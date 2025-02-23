from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupportTicketViewSet, LabSupportViewSet, LabSupportLimitViewSet

router = DefaultRouter()
router.register(r'tickets', SupportTicketViewSet, basename='support-ticket')
router.register(r'lab-support', LabSupportViewSet, basename='lab-support')
router.register(r'lab-support-limits', LabSupportLimitViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 