from django.contrib import admin
from .models import Lab

@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('title', 'description', 'content')
    raw_id_fields = ('product',)
