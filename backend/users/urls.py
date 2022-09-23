# from .views import RegisterAPI
from django.urls import path
import users.user_views as user_views
import users.admin_views as admin_views
from knox import views as knox_views

#API endpoints
urlpatterns = [
    #Knox
    path('logout/', knox_views.LogoutView.as_view()),
    path('logoutall/', knox_views.LogoutAllView.as_view()),
    #User
    path('register/', user_views.RegisterView.as_view()), #Register user
    path('login/',user_views.LoginView.as_view()),
    path('get/',user_views.PersonalUserInfoView.as_view()),
    #Admin
    path('admin/register/', admin_views.RegisterView.as_view()), #Register admin
    path('admin/login/',admin_views.LoginView.as_view()),
    path('admin/getuserslist/',admin_views.UsersListView.as_view()),
    path('admin/getadminslist/',admin_views.AdminsListView.as_view()),
    path('admin/approveuser/',admin_views.ApproveUserView.as_view())
]