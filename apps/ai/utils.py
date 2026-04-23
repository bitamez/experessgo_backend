import google.generativeai as genai
import os
from datetime import datetime

class AIProcessor:
    @staticmethod
    def get_chat_response(message):
        import random
        from datetime import date
        from apps.buses.models import Schedule

        api_key = os.getenv('GEMINI_API_KEY')
        
        # If API key is missing or fails, provide a reliable fallback that isn't randomly mismatched.
        mock_response = "I am currently in offline mode (API key missing). I can still help you book a ticket! Please use the search bar above to find available buses to Adama, Hawassa, or Dire Dawa."
        
        if not api_key:
            return mock_response

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Fetch some upcoming schedules to feed the AI
            today = date.today()
            upcoming_schedules = Schedule.objects.select_related('route', 'bus').filter(travel_date__gte=today).order_by('travel_date', 'departure_time')[:10]
            
            schedule_context = "Available Upcoming Schedules:\n"
            if upcoming_schedules.exists():
                for s in upcoming_schedules:
                    schedule_context += f"- {s.route.source_en} to {s.route.destination_en} on {s.travel_date} at {s.departure_time} (Bus: {s.bus.bus_name}, Capacity: {s.bus.total_seats})\n"
            else:
                schedule_context += "No schedules currently available in the database.\n"

            system_prompt = (
                "You are an AI travel assistant for 'ExpressGo', Ethiopia's premium bus service. "
                "Help users with schedules, availability, prices (typically 400-700 ETB), and booking. "
                "Use the following real-time availability context to answer queries accurately:\n"
                f"{schedule_context}\n"
                "Keep responses concise, helpful, and natural."
            )
            
            chat = model.start_chat(history=[
                {"role": "user", "parts": [system_prompt]},
                {"role": "model", "parts": ["Understood. I am ready to help as the ExpressGo assistant!"]}
            ])
            
            response = chat.send_message(message)
            return response.text
        except Exception as e:
            print(f"DEBUG: Gemini API Error: {str(e)}")
            return mock_response

    @staticmethod
    def generate_recommendations(user=None):
        return [
            {
                "id": 1,
                "source": "Addis Ababa",
                "destination": "Hawassa",
                "reason": "Top Rated Destination",
                "next_bus": "08:30 AM",
                "price": "550 ETB"
            },
            {
                "id": 2,
                "source": "Addis Ababa",
                "destination": "Adama",
                "reason": "Most Booked Route",
                "next_bus": "11:00 AM",
                "price": "350 ETB"
            },
            {
                "id": 3,
                "source": "Bahir Dar",
                "destination": "Addis Ababa",
                "reason": "Weekend Special",
                "next_bus": "06:00 AM",
                "price": "650 ETB"
            }
        ]
