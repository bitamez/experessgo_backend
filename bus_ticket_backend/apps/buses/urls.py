from django.urls import path
from .views import ScheduleListView, RouteListView

urlpatterns = [
    path('schedules/', ScheduleListView.as_view(), name='schedules'),
    path('routes/', RouteListView.as_view(), name='routes'),
]
