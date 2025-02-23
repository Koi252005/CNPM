from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('staff', 'Staff'),
        ('customer', 'Customer'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    
    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
