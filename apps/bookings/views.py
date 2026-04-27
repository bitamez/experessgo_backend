import os
import requests
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class ChapaPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # 1. Capture details from request (or defaults for testing)
        amount = request.data.get('amount', 550)
        raw_email = request.data.get('email', '')
        first_name = request.data.get('first_name', 'Customer')
        last_name = request.data.get('last_name', 'User')
        trip_id = request.data.get('trip_id', 'N/A')
        tx_ref = f"expressgo-{uuid.uuid4().hex[:8]}"

        # Sanitize email — Chapa blocks reserved/test domains like example.com
        import re, json
        BLOCKED_DOMAINS = {'example.com', 'example.org', 'example.net', 'test.com', 'test.org', 'localhost'}
        SAFE_FALLBACK_EMAIL = 'customer@gmail.com'

        def is_valid_email(addr):
            if not addr:
                return False
            match = re.match(r'^[^@\s]+@([^@\s]+\.[^@\s]+)$', addr.lower())
            if not match:
                return False
            domain = match.group(1)
            return domain not in BLOCKED_DOMAINS

        email = raw_email if is_valid_email(raw_email) else SAFE_FALLBACK_EMAIL

        # 2. Prepare Chapa API Call
        CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize"
        CHAPA_SECRET_KEY = os.getenv('CHAPA_SECRET_KEY')

        if not CHAPA_SECRET_KEY:
            return Response({
                "status": "error",
                "message": "Payment service is not configured. CHAPA_SECRET_KEY is missing on the server."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://expressgo.vercel.app')

        headers = {
            'Authorization': f'Bearer {CHAPA_SECRET_KEY}',
            'Content-Type': 'application/json'
        }

        # Chapa rules: title ≤16 chars, description only letters/numbers/hyphens/underscores/spaces/dots
        safe_trip_id = re.sub(r'[^a-zA-Z0-9_\-]', '', str(trip_id)) or 'N-A'

        # NOTE: customization MUST be a nested dict, NOT PHP bracket notation
        payload = {
            'amount': str(amount),
            'currency': 'ETB',
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'tx_ref': tx_ref,
            'return_url': f'{FRONTEND_URL}/profile',
            'customization': {
                'title': 'ExpressGo',          # ≤16 chars
                'description': f'Trip {safe_trip_id}'  # only safe chars
            }
        }

        # --- NEW: Save the booking in the database ---
        user_id = request.data.get('user_id')
        seat_number = request.data.get('seat')
        first_name = request.data.get('first_name', 'Passenger')
        if user_id and str(trip_id).isdigit() and seat_number:
            try:
                from apps.users.models import SupabaseUser
                from apps.buses.models import Schedule, Seat
                from apps.bookings.models import Booking, Payment
                
                # FIX: Ensure user exists in 'users' table to satisfy foreign key constraint
                user_obj, _ = SupabaseUser.objects.get_or_create(
                    id=user_id,
                    defaults={'full_name': first_name}
                )
                
                schedule_obj = Schedule.objects.get(schedule_id=trip_id)
                # Find the exact seat for this bus, or create it if missing
                seat_obj, _ = Seat.objects.get_or_create(bus=schedule_obj.bus, seat_number=str(seat_number))
                
                if seat_obj:
                    booking, created = Booking.objects.get_or_create(
                        schedule=schedule_obj,
                        seat=seat_obj,
                        defaults={'user': user_obj}
                    )
                    # Create a pending payment record
                    Payment.objects.get_or_create(
                        booking=booking,
                        defaults={
                            'amount': amount,
                            'payment_method': 'Chapa',
                            'status': 'pending'
                        }
                    )
            except Exception as e:
                print("Failed to save booking:", str(e))
        # ---------------------------------------------

        try:
            # 3. Call Chapa API
            response = requests.post(CHAPA_URL, json=payload, headers=headers)
            res_data = response.json()

            if res_data.get('status') == 'success':
                return Response({
                    "status": "success",
                    "checkout_url": res_data['data']['checkout_url'],
                    "tx_ref": tx_ref
                })
            else:
                # Chapa message can be a nested object — always stringify it
                raw_message = res_data.get('message', 'Failed to initialize Chapa payment')
                if isinstance(raw_message, dict) or isinstance(raw_message, list):
                    import json
                    friendly_message = json.dumps(raw_message)
                else:
                    friendly_message = str(raw_message)

                return Response({
                    "status": "error",
                    "message": friendly_message,
                    "debug": res_data  # Full Chapa response for debugging
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "status": "error",
                "message": f"Server Error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TelebirrPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({
            "status": "success",
            "message": "Telebirr payment initialization triggered (Stub)",
            "checkout_url": "https://app.telebirr.et/checkout/demo"
        })

class CBEPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({
            "status": "success",
            "message": "CBE Birr payment initialization triggered (Stub)",
            "checkout_url": "https://cbebirr.com/checkout/demo"
        })
