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

        # ✅ If API key missing → fallback (no developer message shown to users)
        if not api_key:
            print("DEBUG: GEMINI_API_KEY missing.")
            return AIProcessor._build_offline_response(message)

        try:
            genai.configure(api_key=api_key)

            # ✅ FIXED MODEL (Must be gemini-pro to avoid 404 Model Not Found)
            model = genai.GenerativeModel('gemini-pro')

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
                print(f"DEBUG: DB error: {db_err}")
                schedule_context += "Schedule data unavailable.\n"

            # -------- AI System Prompt --------
            system_prompt = (
                "You are an AI travel assistant for ExpressGo (Ethiopia bus service). "
                "Help with routes, schedules, booking, and prices (350–700 ETB). "
                "Be concise (max 2–3 sentences), friendly, and helpful.\n\n"
                f"{schedule_context}"
            )

            # -------- Start Chat --------
            chat = model.start_chat(history=[
                {"role": "user", "parts": [system_prompt]},
                {"role": "model", "parts": ["Ready to assist with ExpressGo travel."]},
            ])

            response = chat.send_message(
                message,
                request_options={"timeout": 10}  # ✅ prevents hanging
            )

            # ✅ Safe response handling
            if hasattr(response, "text") and response.text:
                return response.text.strip()

            return AIProcessor._build_offline_response(message)

        except Exception as e:
            print(f"DEBUG: Gemini Error: {e}")

            err = str(e).lower()

            # ✅ Handle known cases silently → fallback
            if any(k in err for k in [
                "api_key", "invalid", "quota", "429",
                "timeout", "network", "connection", "404"
            ]):
                return AIProcessor._build_offline_response(message)

            # ✅ Unknown error → still fallback (never expose raw error to users)
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
