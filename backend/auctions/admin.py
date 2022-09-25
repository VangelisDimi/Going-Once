from django.contrib import admin
from .models import Auction, AuctionImage,Category,Bid

# Register your models here.
admin.site.register(Auction)
admin.site.register(Category)
admin.site.register(AuctionImage)
admin.site.register(Bid)