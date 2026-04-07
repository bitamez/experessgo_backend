from django.urls import path
from .views import ChapaPaymentView, TelebirrPaymentView, CBEPaymentView

urlpatterns = [
    path('payments/chapa/', ChapaPaymentView.as_view(), name='chapa_payment'),
    path('payments/telebirr/', TelebirrPaymentView.as_view(), name='telebirr_payment'),
    path('payments/cbe/', CBEPaymentView.as_view(), name='cbe_payment'),
]
