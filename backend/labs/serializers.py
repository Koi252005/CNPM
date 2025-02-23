from rest_framework import serializers
from .models import Lab
from accounts.serializers import UserSerializer
from products.serializers import ProductSerializer

class LabSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Lab
        fields = ['id', 'title', 'description', 'product', 'status', 'created_at', 'updated_at', 'author']

class LabDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Lab
        fields = ['id', 'title', 'description', 'content', 'product', 'status', 'created_at', 'updated_at', 'author'] 