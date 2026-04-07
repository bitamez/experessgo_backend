from rest_framework import serializers

class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)

class RecommendationSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    source = serializers.CharField()
    destination = serializers.CharField()
    reason = serializers.CharField()
    next_bus = serializers.CharField()
    price = serializers.CharField()
