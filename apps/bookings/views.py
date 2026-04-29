import os
import re
import json
import uuid
import requests
from datetime import datetime, timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


# ─────────────────────────────────────────
# Chapa Payment Initialization
# ─────────────────────────────────────────
class ChapaPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            amount     = request.data.get('amount', 550)
            raw_email  = request.data.get('email', '')
            first_name = request.data.get('first_name', 'Customer')
            last_name  = request.data.get('last_name', 'User')
            trip_id    = request.data.get('trip_id', 'N/A')
            user_id    = request.data.get('user_id', '')
            seat       = request.data.get('seat', '')
            tx_ref     = f"expressgo-{uuid.uuid4().hex[:12]}"

            # ── Sanitize email ──────────────────────────────────────────
            BLOCKED_DOMAINS   = {'example.com', 'example.org', 'example.net',
                                  'test.com', 'test.org', 'localhost'}
            SAFE_EMAIL        = 'customer@gmail.com'

            def is_valid_email(addr):
                if not addr:
                    return False
                m = re.match(r'^[^@\s]+@([^@\s]+\.[^@\s]+)$', str(addr).lower())
                return bool(m) and m.group(1) not in BLOCKED_DOMAINS

            email = raw_email if is_valid_email(raw_email) else SAFE_EMAIL

            # ── Check Chapa key ─────────────────────────────────────────
            CHAPA_SECRET_KEY = os.getenv('CHAPA_SECRET_KEY')
            if not CHAPA_SECRET_KEY:
                return Response({
                    'status': 'error',
                    'message': 'Payment service not configured (missing CHAPA_SECRET_KEY).'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://expressgo.vercel.app')

            # Chapa title ≤ 16 chars, description only safe chars
            safe_trip_id = re.sub(r'[^a-zA-Z0-9_\-]', '', str(trip_id)) or 'NA'

            payload = {
                'amount':      str(amount),
                'currency':    'ETB',
                'email':       email,
                'first_name':  str(first_name),
                'last_name':   str(last_name),
                'tx_ref':      tx_ref,
                'return_url':  f'{FRONTEND_URL}/profile?tx_ref={tx_ref}',
                'customization': {
                    'title':       'ExpressGo',
                    'description': f'Trip {safe_trip_id}',
                },
                # Pass booking details as metadata — Chapa returns them in verify response
                'meta': {
                    'user_id': str(user_id),
                    'trip_id': str(trip_id),
                    'seat':    str(seat),
                    'amount':  str(amount),
                },
            }

            headers = {
                'Authorization': f'Bearer {CHAPA_SECRET_KEY}',
                'Content-Type':  'application/json',
            }

            try:
                res      = requests.post('https://api.chapa.co/v1/transaction/initialize',
                                         json=payload, headers=headers, timeout=15)
                res_data = res.json()
            except Exception as e:
                return Response({'status': 'error', 'message': f'Chapa request failed: {e}'},
                                status=status.HTTP_502_BAD_GATEWAY)

            if res_data.get('status') == 'success':
                return Response({
                    'status':       'success',
                    'checkout_url': res_data['data']['checkout_url'],
                    'tx_ref':       tx_ref,
                })

            # Chapa returned an error — stringify the message safely
            raw_msg = res_data.get('message', 'Failed to initialize Chapa payment')
            msg     = json.dumps(raw_msg) if isinstance(raw_msg, (dict, list)) else str(raw_msg)
            return Response({'status': 'error', 'message': msg, 'debug': res_data},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as global_e:
            import traceback
            return Response({
                'status': 'error',
                'message': f"Unexpected server error: {str(global_e)}",
                'traceback': traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────
# Chapa Payment Verification + Booking Save
# ─────────────────────────────────────────
class ChapaVerifyView(APIView):
    def get(self, request):
        tx_ref = request.query_params.get('tx_ref', '').strip()
        if not tx_ref:
            return Response({'status': 'error', 'message': 'tx_ref is required'}, status=400)

        CHAPA_SECRET_KEY = os.getenv('CHAPA_SECRET_KEY')
        
        # 1. Verify with Chapa
        verify_url = f'https://api.chapa.co/v1/transaction/verify/{tx_ref}'
        headers = {'Authorization': f'Bearer {CHAPA_SECRET_KEY}'}

        try:
            chapa_res = requests.get(verify_url, headers=headers, timeout=15)
            chapa_data = chapa_res.json()
        except Exception as e:
            return Response({'status': 'error', 'message': f'Connection failed: {e}'}, status=502)

        # Check if Chapa actually confirmed the payment
        if chapa_data.get('status') != 'success' or chapa_data.get('data', {}).get('status') != 'success':
            return Response({
                'status': 'pending',
                'message': 'Payment not confirmed by bank yet.',
                'chapa_status': chapa_data.get('data', {}).get('status', 'unknown')
            }, status=200)

        tx_data = chapa_data.get('data', {})
        meta = tx_data.get('meta', {})

        # 2. Atomic Database Operations
        try:
            from django.db import transaction, DatabaseError
            from django.db.models import F
            from apps.users.models import SupabaseUser
            from apps.buses.models import Schedule, Seat
            from apps.bookings.models import Booking, Payment

            with transaction.atomic():
                # Use select_for_update() to lock the schedule row and prevent race conditions
                schedule_id = meta.get('trip_id')
                user_id = meta.get('user_id')
                seat_num = meta.get('seat')

                if not (schedule_id and user_id):
                    raise ValueError("Missing metadata in Chapa response")

                schedule_obj = Schedule.objects.select_for_update().get(schedule_id=int(schedule_id))
                
                # Ensure user exists
                user_obj, _ = SupabaseUser.objects.get_or_create(
                    id=user_id,
                    defaults={'full_name': tx_data.get('first_name', 'Passenger')}
                )

                # Find or Create Seat
                if seat_num:
                    seat_obj, _ = Seat.objects.get_or_create(
                        bus=schedule_obj.bus,
                        seat_number=str(seat_num)
                    )
                else:
                    seat_obj = Seat.objects.filter(bus=schedule_obj.bus).first()

                if not seat_obj:
                    raise ValueError("No seat available")

                # Create Booking (get_or_create prevents duplicate records for same tx_ref)
                booking, created = Booking.objects.get_or_create(
                    schedule=schedule_obj,
                    seat=seat_obj,
                    user=user_obj,
                    # You might want to store tx_ref in your Booking model for safety
                )

                if created:
                    # Create Payment Record
                    Payment.objects.create(
                        booking=booking,
                        amount=tx_data.get('amount'),
                        payment_method='Chapa',
                        status='success',
                        paid_at=datetime.now(tz=timezone.utc)
                    )
                    
                    # Increment ticket count safely
                    SupabaseUser.objects.filter(id=user_id).update(tickets_count=F('tickets_count') + 1)

            return Response({
                'status': 'success',
                'message': 'Booking confirmed!',
                'booking_id': booking.booking_id
            })

        except Schedule.DoesNotExist:
            return Response({'status': 'error', 'message': 'Trip not found'}, status=404)
        except Exception as e:
            print(f"Internal Error: {str(e)}")
            return Response({'status': 'error', 'message': 'Database save failed'}, status=500)


# ─────────────────────────────────────────
# User's Booking History
# ─────────────────────────────────────────
class MyBookingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id', '').strip()
        if not user_id:
            return Response({'status': 'error', 'message': 'user_id is required'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            from apps.bookings.models import Booking
            bookings = (Booking.objects
                        .filter(user_id=user_id)
                        .select_related('schedule__route', 'seat')
                        .order_by('-created_at'))

            history = []
            for b in bookings:
                route = getattr(b.schedule, 'route', None) if b.schedule else None
                history.append({
                    'booking_id': b.booking_id,
                    'from':       getattr(route, 'source_en',      'Route')       if route else 'Route',
                    'to':         getattr(route, 'destination_en', 'Destination') if route else 'Destination',
                    'date':       str(b.schedule.travel_date)    if b.schedule else '',
                    'departure':  str(b.schedule.departure_time) if b.schedule else '',
                    'seat':       b.seat.seat_number             if b.seat     else '',
                    'status':     'Confirmed',
                    'created_at': b.created_at.isoformat()       if b.created_at else '',
                })

            return Response({'status': 'success', 'count': len(history), 'bookings': history})

        except Exception as e:
            return Response({'status': 'error', 'message': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────
# Stub views (Telebirr / CBE Birr)
# ─────────────────────────────────────────
class TelebirrPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({
            'status':       'success',
            'message':      'Telebirr payment initialization triggered (Stub)',
            'checkout_url': 'https://app.telebirr.et/checkout/demo',
        })


class CBEPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({
            'status':       'success',
            'message':      'CBE Birr payment initialization triggered (Stub)',
            'checkout_url': 'https://cbebirr.com/checkout/demo',
        })
