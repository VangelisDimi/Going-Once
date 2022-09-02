from django.urls import path
from .views import CreateAuctionView

#API endpoints
urlpatterns = [
   path('create/',CreateAuctionView.as_view()),
]