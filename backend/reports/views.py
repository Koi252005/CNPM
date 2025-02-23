from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from orders.models import Order
from support.models import SupportTicket
from datetime import datetime, timedelta
from django.db.models import Q

# Create your views here.

class SalesReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
        else:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

        sales_data = Order.objects.filter(
            created_at__date__range=[start_date, end_date]
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            total=Sum('total_amount'),
            orders=Count('id')
        ).order_by('date')

        return Response(sales_data)

class SupportReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)

        support_data = SupportTicket.objects.filter(
            created_at__date__range=[start_date, end_date]
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            tickets=Count('id'),
            resolved=Count('id', filter=Q(status='resolved'))
        ).order_by('date')

        return Response(support_data)

class DeliveryReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        delivery_data = Order.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')

        return Response(delivery_data)
