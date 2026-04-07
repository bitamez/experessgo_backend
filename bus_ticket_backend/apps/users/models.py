from django.db import models
import uuid

# Map to the 'public.users' table in Supabase
class SupabaseUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.TextField(null=True, blank=True)
    phone = models.TextField(unique=True, null=True, blank=True)
    role = models.TextField(default='user')
    tickets_count = models.IntegerField(default=0)
    bonus_tickets = models.IntegerField(default=0)
    preferred_language = models.TextField(default='am')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False # Don't let Django manage translations for existing tables
        db_table = 'public.users'

    def __str__(self):
        return self.full_name or str(self.id)
