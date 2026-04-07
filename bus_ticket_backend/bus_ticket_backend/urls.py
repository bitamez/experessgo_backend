from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Welcome to the ExpressGo API", "status": "Running"})

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/ai/', include('apps.ai.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/buses/', include('apps.buses.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
]
