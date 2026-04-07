from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import AIProcessor
from .serializers import RecommendationSerializer

class AIChatView(APIView):
    authentication_classes = [] # Temporarily disable auth to isolate network issue
    permission_classes = []     # Temporarily allow all
    
    def post(self, request):
        print("DEBUG: AIChatView POST start")
        message = request.data.get('message', '')
        print(f"DEBUG: AI Chat received message: {message}")
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        response_text = AIProcessor.get_chat_response(message)
        print(f"DEBUG: AI Chat response: {response_text}")
        return Response({"response": response_text})

class AIRecommendationView(APIView):
    authentication_classes = [] 
    permission_classes = []
    
    def get(self, request):
        print("DEBUG: AIRecommendationView GET start")
        recommendations = AIProcessor.generate_recommendations(None)
        serializer = RecommendationSerializer(recommendations, many=True)
        return Response(serializer.data)
