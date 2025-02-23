from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
from .models import SupportTicket, SupportMessage, LabSupport, LabSupportLimit
from .serializers import (
    SupportTicketSerializer, 
    SupportMessageSerializer,
    LabSupportSerializer,
    LabSupportLimitSerializer
)

# Create your views here.

class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (obj.user == request.user or 
                request.user.role in ['admin', 'manager', 'staff'])

class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'staff']:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        ticket = self.get_object()
        serializer = SupportMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ticket=ticket, sender=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign_staff(self, request, pk=None):
        ticket = self.get_object()
        
        if request.user.role not in ['admin', 'manager', 'staff']:
            return Response({'error': 'Permission denied'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        ticket.staff = request.user
        ticket.status = 'in_progress'
        ticket.save()
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response({'error': 'Status is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if new_status not in [choice[0] for choice in SupportTicket.STATUS_CHOICES]:
            return Response({'error': 'Invalid status'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if request.user.role not in ['admin', 'manager', 'staff']:
            return Response({'error': 'Permission denied'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        ticket.status = new_status
        ticket.save()
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)

class LabSupportViewSet(viewsets.ModelViewSet):
    serializer_class = LabSupportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'staff']:
            return LabSupport.objects.all()
        return LabSupport.objects.filter(customer=user)

    def perform_create(self, serializer):
        # Check support limits
        lab_id = self.request.data.get('lab_id')
        customer = self.request.user
        
        try:
            support_limit = LabSupportLimit.objects.get(lab_id=lab_id)
            used_count = LabSupport.objects.filter(
                lab_id=lab_id,
                customer=customer
            ).count()

            if used_count >= support_limit.max_support_count:
                return Response(
                    {'error': 'Maximum support limit reached for this lab'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except LabSupportLimit.DoesNotExist:
            pass

        serializer.save(
            customer=customer,
            staff=self.request.user if self.request.user.role in ['admin', 'staff'] else None
        )

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        support = self.get_object()
        if not support.is_resolved:
            support.is_resolved = True
            support.resolved_at = timezone.now()
            support.save()
        return Response(self.get_serializer(support).data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        user = request.user
        if user.role not in ['admin', 'staff', 'manager']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        stats = {
            'total_supports': LabSupport.objects.count(),
            'resolved_supports': LabSupport.objects.filter(is_resolved=True).count(),
            'support_by_type': LabSupport.objects.values('support_type').annotate(
                count=Count('id')
            ),
            'support_by_lab': LabSupport.objects.values('lab__title').annotate(
                count=Count('id')
            ),
            'staff_performance': LabSupport.objects.values('staff__username').annotate(
                total_supports=Count('id'),
                resolved_supports=Count('id', filter=Q(is_resolved=True))
            )
        }
        return Response(stats)

class LabSupportLimitViewSet(viewsets.ModelViewSet):
    queryset = LabSupportLimit.objects.all()
    serializer_class = LabSupportLimitSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]  # Only admin/staff can modify
        return super().get_permissions()
