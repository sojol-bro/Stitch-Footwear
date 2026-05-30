from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, ReviewViewSet, OrderViewSet,
    MessageViewSet, NewsletterSubscriptionViewSet,
    DashboardStatsView, CustomerCRMListView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'subscriptions', NewsletterSubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('crm/customers/', CustomerCRMListView.as_view(), name='crm-customers'),
]
