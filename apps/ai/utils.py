import google.generativeai as genai
import os
from datetime import date


class AIProcessor:

    @staticmethod
    def _build_offline_response(message: str) -> str:
        """Context-aware offline reply based on user message keywords."""
        msg = message.lower()
        if any(k in msg for k in ['price', 'cost', 'fare', 'how much']):
            return (
                "Typical fares: Addis Ababa → Adama (350 ETB), "
                "Addis Ababa → Hawassa (550 ETB), Bahir Dar → Addis Ababa (650 ETB). "
                "I'm in offline mode right now — use the search bar above for exact prices."
            )
        if any(k in msg for k in ['schedule', 'time', 'when', 'depart']):
            return (
                "Popular departure times: 06:00 AM, 08:30 AM, 11:00 AM, 2:00 PM. "
                "I'm in offline mode — please use the search bar to find live schedules."
            )
        if any(k in msg for k in ['book', 'ticket', 'seat', 'reserve']):
            return (
                "To book a ticket: search your route in the bar above → select a schedule → "
                "choose your seat → proceed to payment. I'm in offline mode but the booking system works fine!"
            )
        return (
            "I'm in offline mode right now (the AI server is warming up). "
            "You can still search for buses using the search bar above! "
            "Popular routes: Addis Ababa → Adama (350 ETB), → Hawassa (550 ETB), Bahir Dar → Addis Ababa (650 ETB)."
        )

    @staticmethod
    def get_chat_response(message: str) -> str:
        api_key = os.getenv('GEMINI_API_KEY')

        if not api_key:
            print("DEBUG: GEMINI_API_KEY not set — using offline fallback.")
            return "DEVELOPER ERROR: GEMINI_API_KEY is completely missing from the Render dashboard. Please add it in Render -> Environment Variables."

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')

            # Fetch upcoming schedules for context
            today = date.today()
            schedule_context = "Available Upcoming Schedules:\n"
            try:
                from apps.buses.models import Schedule
                upcoming = (
                    Schedule.objects
                    .select_related('route', 'bus')
                    .filter(travel_date__gte=today)
                    .order_by('travel_date', 'departure_time')[:10]
                )
                if upcoming.exists():
                    for s in upcoming:
                        schedule_context += (
                            f"- {s.route.source_en} to {s.route.destination_en} "
                            f"on {s.travel_date} at {s.departure_time} "
                            f"(Bus: {s.bus.bus_name}, Seats: {s.bus.total_seats})\n"
                        )
                else:
                    schedule_context += "No schedules currently in database.\n"
            except Exception as db_err:
                print(f"DEBUG: DB error fetching schedules: {db_err}")
                schedule_context += "Could not fetch schedules from database.\n"

            system_prompt = (
                "You are an AI travel assistant for 'ExpressGo', Ethiopia's premium bus service. "
                "Help users with schedules, availability, prices (typically 350-700 ETB), and booking. "
                "Use the following real-time data to answer accurately:\n"
                f"{schedule_context}\n"
                "Keep responses concise, friendly, and under 3 sentences."
            )

            chat = model.start_chat(history=[
                {"role": "user", "parts": [system_prompt]},
                {"role": "model", "parts": ["Understood! I'm ready to help as the ExpressGo AI assistant."]},
            ])

            response = chat.send_message(message)
            return response.text

        except Exception as e:
            err_str = str(e).lower()
            error_details = str(e)
            print(f"DEBUG: Gemini API Error — {e}")

            if 'api_key' in err_str or 'invalid' in err_str or '400' in err_str:
                return f"DEVELOPER ERROR: Gemini API key is invalid or rejected. Details: {error_details}"
            elif 'quota' in err_str or '429' in err_str:
                return "DEVELOPER ERROR: Gemini Quota Exceeded (You ran out of free credits)."
            elif 'network' in err_str or 'timeout' in err_str or 'connection' in err_str:
                return f"DEVELOPER ERROR: Network failure reaching Gemini. Details: {error_details}"

            return f"DEVELOPER ERROR: Unexpected error connecting to AI: {error_details}"

    @staticmethod
    def generate_recommendations(user=None):
        return [
            {
                "id": 1,
                "source": "Addis Ababa",
                "destination": "Hawassa",
                "reason": "Top Rated Destination",
                "next_bus": "08:30 AM",
                "price": "550 ETB",
            },
            {
                "id": 2,
                "source": "Addis Ababa",
                "destination": "Adama",
                "reason": "Most Booked Route",
                "next_bus": "11:00 AM",
                "price": "350 ETB",
            },
            {
                "id": 3,
                "source": "Bahir Dar",
                "destination": "Addis Ababa",
                "reason": "Weekend Special",
                "next_bus": "06:00 AM",
                "price": "650 ETB",
            },
        ]
