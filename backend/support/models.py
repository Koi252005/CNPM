from django.db import models
from django.conf import settings
from labs.models import Lab

# Create your models here.

class SupportTicket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets', null=True)
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='support_tickets')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'support_tickets'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.user.username}"

class SupportMessage(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'support_messages'
        ordering = ['created_at']
        
    def __str__(self):
        return f"Message from {self.sender.username} on {self.ticket.title}"

class LabSupport(models.Model):
    SUPPORT_TYPE_CHOICES = [
        ('technical', 'Technical Support'),
        ('guidance', 'Lab Guidance'),
        ('troubleshooting', 'Troubleshooting'),
        ('other', 'Other'),
    ]

    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='lab_supports')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_lab_supports')
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='provided_lab_supports')
    support_type = models.CharField(max_length=20, choices=SUPPORT_TYPE_CHOICES)
    description = models.TextField()
    solution = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Support for {self.lab.title} - {self.customer.username}"

class LabSupportLimit(models.Model):
    lab = models.OneToOneField(Lab, on_delete=models.CASCADE)
    max_support_count = models.IntegerField(default=3)
    support_duration_limit = models.IntegerField(default=60)  # minutes

    def __str__(self):
        return f"Support limit for {self.lab.title}"
