import traceback
from django.http import JsonResponse

class Json500Middleware:
    """
    Catches any unhandled exceptions during the request/response cycle
    and returns a JSON response instead of the default HTML 500 page.
    This ensures the frontend always receives JSON, even for fatal crashes.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        return JsonResponse({
            'status': 'error',
            'message': f"Fatal Django Server Error: {str(exception)}",
            'traceback': traceback.format_exc()
        }, status=500)
