from django.urls import path
from .views import CreateAuctionView,ExportXMLView,ExportJSONView

#API endpoints
urlpatterns = [
   path('create/',CreateAuctionView.as_view()),
   path('exportxml/',ExportXMLView.as_view()),
   path('exportjson/',ExportJSONView.as_view())
]