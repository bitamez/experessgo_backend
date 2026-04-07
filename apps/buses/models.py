from django.db import models

class Bus(models.Model):
    bus_id = models.AutoField(primary_key=True)
    bus_name = models.TextField()
    bus_number = models.TextField(unique=True)
    total_seats = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'buses'
        verbose_name_plural = "Buses"

    def __str__(self):
        return f"{self.bus_name} ({self.bus_number})"

class Seat(models.Model):
    seat_id = models.AutoField(primary_key=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, db_column='bus_id')
    seat_number = models.TextField()

    class Meta:
        managed = False
        db_table = 'seats'
        unique_together = [['bus', 'seat_number']]

class Route(models.Model):
    route_id = models.AutoField(primary_key=True)
    source_en = models.TextField()
    destination_en = models.TextField()
    source_am = models.TextField()
    destination_am = models.TextField()

    class Meta:
        managed = False
        db_table = 'routes'

    def __str__(self):
        return f"{self.source_en} to {self.destination_en}"

class Schedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, db_column='bus_id')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, db_column='route_id')
    travel_date = models.DateField()
    departure_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'schedules'

    def __str__(self):
        return f"{self.route} on {self.travel_date} at {self.departure_time}"
