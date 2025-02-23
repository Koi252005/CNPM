from django.urls import path
from .views import SalesReportView, SupportReportView, DeliveryReportView

urlpatterns = [
    path('sales/', SalesReportView.as_view(), name='sales-report'),
    path('support/', SupportReportView.as_view(), name='support-report'),
    path('delivery/', DeliveryReportView.as_view(), name='delivery-report'),
] 