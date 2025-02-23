from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

# Create your views here.

class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (obj.customer == request.user or 
                request.user.role in ['admin', 'manager', 'staff'])

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return Order.objects.all()
        elif user.role == 'staff':
            return Order.objects.exclude(status='pending')
        return Order.objects.filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response({'error': 'Status is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if new_status not in [choice[0] for choice in Order.STATUS_CHOICES]:
            return Response({'error': 'Invalid status'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Only staff and above can update status
        if request.user.role not in ['admin', 'manager', 'staff']:
            return Response({'error': 'Permission denied'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Activate labs when order is delivered
        if new_status == 'delivered':
            order_items = OrderItem.objects.filter(order=order)
            order_items.update(labs_activated=True)
        
        order.status = new_status
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)
