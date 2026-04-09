from django.contrib import admin
from .models import Bus, Seat, Route, Schedule


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0
    fields = ('seat_number',)


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_id', 'bus_name', 'bus_number', 'total_seats')
    search_fields = ('bus_name', 'bus_number')
    list_per_page = 25
    inlines = [SeatInline]


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('seat_id', 'bus', 'seat_number')
    list_filter = ('bus',)
    search_fields = ('seat_number', 'bus__bus_name')
    list_per_page = 50


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('route_id', 'source_en', 'destination_en', 'source_am', 'destination_am')
    search_fields = ('source_en', 'destination_en')
    list_per_page = 25


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('schedule_id', 'bus', 'route', 'travel_date', 'departure_time')
    list_filter = ('travel_date', 'bus', 'route')
    search_fields = ('bus__bus_name', 'route__source_en', 'route__destination_en')
    date_hierarchy = 'travel_date'
    ordering = ('travel_date', 'departure_time')
    list_per_page = 25
