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
        email = request.data.get('email', 'customer@example.com')
        first_name = request.data.get('first_name', 'Customer')
        last_name = request.data.get('last_name', 'User')
        trip_id = request.data.get('trip_id', 'N/A')
        tx_ref = f"expressgo-{uuid.uuid4().hex[:8]}"

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

        # NOTE: customization MUST be a nested dict, NOT PHP bracket notation
        payload = {
            'amount': str(amount),
            'currency': 'ETB',
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'tx_ref': tx_ref,
            'callback_url': f'{FRONTEND_URL}/payment/callback',
            'return_url': f'{FRONTEND_URL}/profile',
            'customization': {
                'title': 'ExpressGo Bus Ticket',
                'description': f'Booking for trip ID: {trip_id}'
            }
        }

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
