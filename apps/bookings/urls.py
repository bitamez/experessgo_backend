from django.urls import path
from .views import ChapaPaymentView, TelebirrPaymentView, CBEPaymentView, ChapaVerifyView, MyBookingsView, CancelBookingView

urlpatterns = [
    path('payments/chapa/', ChapaPaymentView.as_view(), name='chapa_payment'),
    path('payments/chapa/verify/', ChapaVerifyView.as_view(), name='chapa_verify'),
    path('payments/telebirr/', TelebirrPaymentView.as_view(), name='telebirr_payment'),
    path('payments/cbe/', CBEPaymentView.as_view(), name='cbe_payment'),
    path('my-bookings/', MyBookingsView.as_view(), name='my_bookings'),
    path('cancel/', CancelBookingView.as_view(), name='cancel_booking'),
]
