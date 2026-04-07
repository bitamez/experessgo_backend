import os
import requests
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ChapaPaymentView(APIView):
    def post(self, request):
        # 1. Capture details from request (or defaults for testing)
        amount = request.data.get('amount', 550)
        email = request.data.get('email', 'customer@example.com')
        first_name = request.data.get('first_name', 'Customer')
        last_name = request.data.get('last_name', 'User')
        tx_ref = f"expressgo-{uuid.uuid4().hex[:8]}"
        
        # 2. Prepare Chapa API Call
        CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize"
        CHAPA_SECRET_KEY = os.getenv('CHAPA_SECRET_KEY')
        
        headers = {
            'Authorization': f'Bearer {CHAPA_SECRET_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'amount': str(amount),
            'currency': 'ETB',
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'tx_ref': tx_ref,
            'callback_url': 'https://expressgo.api/payment-callback',
            'return_url': 'http://localhost:5173/profile', # Redirect back to user's bookings after payment
            'customization[title]': 'ExpressGo Bus Ticket',
            'customization[description]': f'Booking for trip ID: {request.data.get("trip_id", "N/A")}'
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
                # Fail-safe: If API fails, return a clear error
                return Response({
                    "status": "error",
                    "message": res_data.get('message', 'Failed to initialize Chapa payment')
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                "status": "error",
                "message": f"Server Error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TelebirrPaymentView(APIView):
    def post(self, request):
        return Response({
            "status": "success",
            "message": "Telebirr payment initialization triggered (Stub)",
            "checkout_url": "https://app.telebirr.et/checkout/demo"
        })

class CBEPaymentView(APIView):
    def post(self, request):
        return Response({
            "status": "success",
            "message": "CBE Birr payment initialization triggered (Stub)",
            "checkout_url": "https://cbebirr.com/checkout/demo"
        })
