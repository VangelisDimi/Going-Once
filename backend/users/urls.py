# from .views import RegisterAPI
from django.urls import path
from .views import UserRegisterView,AdminRegisterView,UserGetPersonalView,LoginView #LoginViews
from knox import views as knox_views

#API endpoints
urlpatterns = [
    path('register/', UserRegisterView.as_view()), #Register user
    path('admin/register/', AdminRegisterView.as_view()), #Register admin
    path('login/',LoginView.as_view()),
    path('logout/', knox_views.LogoutView.as_view()),
    path('logoutall/', knox_views.LogoutAllView.as_view()),
    path('get/',UserGetPersonalView.as_view()),
]