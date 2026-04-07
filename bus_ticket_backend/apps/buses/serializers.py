from rest_framework import serializers
from .models import Schedule, Bus, Route

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    bus = BusSerializer(read_only=True)
    route = RouteSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = '__all__'
