from django.urls import path
from .views import AIChatView, AIRecommendationView

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai_chat'),
    path('recommendations/', AIRecommendationView.as_view(), name='ai_recommendations'),
]
