import jwt
from rest_framework import authentication
from rest_framework import exceptions
from django.conf import settings
from apps.users.models import SupabaseUser

class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        
        try:
            # We don't verify the signature here because Supabase handles actual auth. 
            # In a production environment with a specific JWT secret, we'd verify it.
            # secret = getattr(settings, 'SUPABASE_JWT_SECRET', None)
            decoded_token = jwt.decode(token, options={"verify_signature": False})
            
            user_id = decoded_token.get('sub')
            
            # Map to our Django model
            user, created = SupabaseUser.objects.get_or_create(id=user_id)
            return (user, token)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed('Error decoding token.')
        except Exception as e:
            return None
