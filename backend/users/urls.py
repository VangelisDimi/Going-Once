# from .views import RegisterAPI
from django.urls import path
from .views import UserRegisterView,AdminRegisterView,UserGetPersonalView #LoginViews
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

#API endpoints
urlpatterns = [
    path('register/', UserRegisterView.as_view()), #Register user
    path('admin/register/', AdminRegisterView.as_view()), #Register admin
    path('token/', TokenObtainPairView.as_view()), #Login
    path('token/refresh/', TokenRefreshView.as_view()), #Refresh Login
    path('token/blacklist/', TokenBlacklistView.as_view()), #Logout
    path('get/',UserGetPersonalView.as_view()),
]