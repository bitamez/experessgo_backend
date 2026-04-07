from rest_framework.generics import ListAPIView
from .models import Schedule, Route
from .serializers import ScheduleSerializer, RouteSerializer

class ScheduleListView(ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class RouteListView(ListAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
