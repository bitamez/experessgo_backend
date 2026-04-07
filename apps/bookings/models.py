from django.db import models
from apps.users.models import SupabaseUser
from apps.buses.models import Schedule, Seat

class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(SupabaseUser, on_delete=models.CASCADE, db_column='user_id')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, db_column='schedule_id')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, db_column='seat_id')
    is_bonus = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'bookings'
        unique_together = [['schedule', 'seat']]

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, db_column='booking_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.TextField()
    status = models.TextField()
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'payments'
