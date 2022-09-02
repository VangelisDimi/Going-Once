from re import T
from django.db import models
from users.models import AppUser

#null=False

# Create your models here.
class Category(models.Model):
    tag = models.CharField(max_length=150,blank=False)

class Auction(models.Model):
    #pk = id
    name = models.CharField(max_length=150,blank=False)
    categories = models.ManyToManyField(Category)
    first_bid = models.DecimalField(max_digits=7, decimal_places=2,blank=False)#in dollars
    location = models.CharField(max_length=50,blank=False)
    latitude = models.DecimalField(max_digits=8, decimal_places=6,blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6,blank=True)
    country = models.CharField(max_length=50,blank=False)
    started = models.DateTimeField(blank=True)
    ends = models.DateTimeField(blank=True)
    description = models.CharField(max_length=500,blank=True)

    seller =  models.ForeignKey(AppUser, related_name='auctions', on_delete=models.CASCADE,blank=False)

class Bid(models.Model):
    #pk = id
    time =  models.DateTimeField(blank=False)
    amount = models.DecimalField(max_digits=7, decimal_places=2,blank=False)#in dollars

    auction = models.ForeignKey(Auction, related_name='bids', on_delete=models.CASCADE,blank=False)
    bidder = models.ForeignKey(AppUser, related_name='bids', on_delete=models.CASCADE,blank=False)