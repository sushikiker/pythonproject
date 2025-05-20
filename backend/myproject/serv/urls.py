from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from .views import RegisterCustomerView,CreateOrder
router = DefaultRouter()
router.register(r'products', ProductViewSet)
from django.urls import path
from .views import  login_customer,update_profile, get_recent_orders


urlpatterns = [
   path('api/', include(router.urls)),
   path("api/register/", RegisterCustomerView.as_view(), name="register_customer"),
   path("api/login/", login_customer, name="login"),
   path("api/update-profile/", update_profile, name="update-profile"),
    path("api/add-order/", CreateOrder.as_view(), name="add-order"),
    path("api/recent-orders/", get_recent_orders, name="recent-orders"),
]


