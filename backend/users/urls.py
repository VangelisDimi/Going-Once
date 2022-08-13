# from .views import RegisterAPI
from django.urls import path
from .views import RegisterView#,LoginView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

#API endpoints
urlpatterns = [
    path('register/', RegisterView.as_view()), #Register
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), #Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), #Refresh Login
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist') #Logout
]