from django.contrib import admin
from .models import SupabaseUser


@admin.register(SupabaseUser)
class SupabaseUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone', 'role', 'tickets_count', 'bonus_tickets', 'preferred_language', 'created_at')
    list_filter = ('role', 'preferred_language')
    search_fields = ('full_name', 'phone', 'id')
    readonly_fields = ('id', 'created_at')
    ordering = ('-created_at',)
    list_per_page = 25
    fieldsets = (
        ('Identity', {
            'fields': ('id', 'full_name', 'phone')
        }),
        ('Permissions & Preferences', {
            'fields': ('role', 'preferred_language')
        }),
        ('Rewards', {
            'fields': ('tickets_count', 'bonus_tickets')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
