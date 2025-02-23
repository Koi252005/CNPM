from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product
from labs.models import Lab
from .serializers import ProductSerializer
from labs.serializers import LabSerializer, LabDetailSerializer

# Create your views here.

class IsManagerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role in ['admin', 'manager']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def labs(self, request, pk=None):
        product = self.get_object()
        labs = Lab.objects.filter(product=product)
        serializer = LabSerializer(labs, many=True)
        return Response(serializer.data)

class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [permissions.IsAuthenticated, IsManagerOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LabDetailSerializer
        return LabSerializer

    def get_queryset(self):
        queryset = Lab.objects.all()
        if self.request.user.role == 'customer':
            # Customers can only see published labs they have purchased
            return queryset.filter(status='published', 
                                 product__orderitem__order__customer=self.request.user,
                                 product__orderitem__labs_activated=True)
        return queryset
