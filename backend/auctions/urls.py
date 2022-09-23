from django.urls import path
from .views import CreateAuctionView,UpdateAuction,ExportXMLView,ExportJSONView,GetAuctionsManage,GetAuction,DeleteAuction,GetAuctionsNavigate

#API endpoints
urlpatterns = [
   path('create/',CreateAuctionView.as_view()),
   path('update/',UpdateAuction.as_view()),
   path('delete/',DeleteAuction.as_view()),
   path('get/',GetAuction.as_view()),
   path('getlistmanage/',GetAuctionsManage.as_view()),
   path('getlistnavigate/',GetAuctionsNavigate.as_view()),
   path('exportxml/',ExportXMLView.as_view()),
   path('exportjson/',ExportJSONView.as_view())
]