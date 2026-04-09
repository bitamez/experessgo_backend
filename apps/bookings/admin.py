from django.contrib import admin
from .models import Booking, Payment


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ('paid_at',)
    fields = ('amount', 'payment_method', 'status', 'paid_at')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'user', 'schedule', 'seat', 'is_bonus', 'created_at')
    list_filter = ('is_bonus', 'created_at', 'schedule__travel_date')
    search_fields = ('user__full_name', 'seat__seat_number', 'schedule__bus__bus_name')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    list_per_page = 25
    inlines = [PaymentInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'booking', 'amount', 'payment_method', 'status', 'paid_at')
    list_filter = ('status', 'payment_method', 'paid_at')
    search_fields = ('booking__user__full_name', 'status', 'payment_method')
    readonly_fields = ('paid_at',)
    ordering = ('-paid_at',)
    list_per_page = 25
