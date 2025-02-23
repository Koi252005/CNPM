from rest_framework import serializers
from .models import SupportTicket, SupportMessage, LabSupport, LabSupportLimit
from accounts.serializers import UserSerializer
from labs.serializers import LabSerializer

class SupportMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = SupportMessage
        fields = ['id', 'message', 'sender', 'created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lab = LabSerializer(read_only=True)
    messages = SupportMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'description', 'user', 'lab', 'status', 'messages', 'created_at', 'updated_at']

class LabSupportSerializer(serializers.ModelSerializer):
    lab = LabSerializer(read_only=True)
    customer = UserSerializer(read_only=True)
    staff = UserSerializer(read_only=True)
    
    class Meta:
        model = LabSupport
        fields = '__all__'

class LabSupportLimitSerializer(serializers.ModelSerializer):
    lab = LabSerializer(read_only=True)
    
    class Meta:
        model = LabSupportLimit
        fields = '__all__' 