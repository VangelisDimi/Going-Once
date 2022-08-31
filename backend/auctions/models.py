from django.db import models
from users.models import AppUser

# Create your models here.
class category(models.Model):
    name = models.CharField(max_length=150,blank=False)

class Auction(models.Model):
    #pk = id
    name = models.CharField(max_length=150,blank=False)
    categorys = models.ManyToManyField(category)
    first_bid = models.DecimalField(max_digits=7, decimal_places=2,blank=False)#in dollars
    location = models.CharField(max_length=50,blank=False)
    latitude = models.DecimalField(max_digits=8, decimal_places=6,blank=False)
    longitude = models.DecimalField(max_digits=9, decimal_places=6,blank=False)
    country = models.CharField(max_length=50,blank=False)
    started = models.DateTimeField(blank=False)
    ends = models.DateTimeField(blank=False)
    description = models.CharField(blank=True,max_length=500)

    seller =  models.ForeignKey(AppUser, related_name='seller', on_delete=models.CASCADE,blank=False)

class bid(models.Model):
    #pk = id
    time =  models.DateTimeField(blank=False)
    amount = models.DecimalField(max_digits=7, decimal_places=2,blank=False)#in dollars

    auction = models.ForeignKey(Auction, related_name='auction', on_delete=models.CASCADE,blank=False)
    bidder = models.ForeignKey(AppUser, related_name='bidder', on_delete=models.CASCADE,blank=False)