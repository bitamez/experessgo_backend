from google import genai
from google.genai import types
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
                "Live prices may vary — please use the search above."
            )

        if any(k in msg for k in ['schedule', 'time', 'when', 'depart']):
            return (
                "Common departure times: 06:00 AM, 08:30 AM, 11:00 AM, 2:00 PM. "
                "Check the search bar for real-time schedules."
            )

        if any(k in msg for k in ['book', 'ticket', 'seat', 'reserve']):
            return (
                "To book: search your route → choose a schedule → select seat → confirm payment. "
                "Booking system is available above."
            )

        return (
            "I'm currently in offline mode, but you can still search routes and book tickets above. "
            "Popular routes: Addis Ababa → Adama, Hawassa, Bahir Dar."
        )

    @staticmethod
    def get_chat_response(message: str) -> str:
        api_key = os.getenv('GEMINI_API_KEY')

        if not api_key:
            print("DEBUG: GEMINI_API_KEY missing.")
            return AIProcessor._build_offline_response(message)

        try:
            # -------- Fetch Schedule Context --------
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
                            f"- {s.route.source_en} → {s.route.destination_en} | "
                            f"{s.travel_date} at {s.departure_time} | "
                            f"Bus: {s.bus.bus_name} ({s.bus.total_seats} seats)\n"
                        )
                else:
                    schedule_context += "No schedules available.\n"

            except Exception as db_err:
                print(f"DEBUG: DB error fetching schedules: {db_err}")
                schedule_context += "Schedule data unavailable.\n"

            # -------- System Prompt --------
            system_prompt = (
                "You are an AI travel assistant for ExpressGo (Ethiopia bus service). "
                "Help with routes, schedules, booking, and prices (350–700 ETB). "
                "Be concise (max 2–3 sentences), friendly, and helpful.\n\n"
                f"{schedule_context}"
            )

            # -------- New google.genai SDK (v1alpha for 2.5 models) --------
            client = genai.Client(
                api_key=api_key,
                http_options={'api_version': 'v1alpha'},
            )

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    max_output_tokens=200,
                    temperature=0.7,
                ),
            )

            if response.text:
                return response.text.strip()

            return AIProcessor._build_offline_response(message)

        except Exception as e:
            print(f"CRITICAL ERROR: {e}")
            return AIProcessor._build_offline_response(message)

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
