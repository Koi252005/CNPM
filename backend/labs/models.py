from django.db import models
from django.conf import settings
from products.models import Product

class Lab(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    content = models.TextField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='labs', null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='labs', null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'labs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.product.name if self.product else 'No Product'}"
