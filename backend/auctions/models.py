import os
from django.db import models
from users.models import AppUser
from django.core.validators import MaxValueValidator, MinValueValidator
from rest_framework import serializers
from datetime import datetime
import pytz

#Auction models
#null=False

class Category(models.Model):
    class Meta:
        verbose_name_plural = "categories"
    def __str__(self):
        return self.name

    name = models.CharField(max_length=150,blank=False,unique=True)

class Auction(models.Model):
    def __str__(self):
        return self.name + " (" + str(self.pk) + ")"
    def set_seller(self,seller_id):
        self.seller=AppUser.objects.get(pk=seller_id)
    def get_current_bid(self):
        bids = Bid.objects.filter(auction=self).order_by('-amount')
        if len(bids)==0:
            return self.first_bid
        else:
            return bids[0].amount
    def get_current_bidder_id(self):
        bids = Bid.objects.filter(auction=self).order_by('-amount')
        if len(bids)==0:
            return ''
        else:
            return bids[0].bidder.pk

    def get_status(self):
        now = datetime.now(pytz.UTC)

        if now < self.started:
            return "pending"
        if now >= self.started:
            if now < self.ends:
                return "active"
            elif now >= self.ends:
                return "closed"

    def clean(self):
        errors = dict()

        now = datetime.now(pytz.UTC)
        difference = self.started - now
        if (difference.total_seconds()/60) < -5:
            errors['started'] = "Auction can't start earlier than now."

        difference=self.ends-self.started
        if difference.total_seconds()<0:
            errors['ends'] = "End date can't be before start date."
        if (difference.total_seconds()/3600)<1 and (difference.total_seconds()/3600)>0:
            errors['started,ends']= "Auction can't last less than one hour."
        if errors:
            raise serializers.ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super(Auction, self).save(*args, **kwargs)
        

    #pk = id
    name = models.CharField(max_length=150,blank=False)
    category = models.ManyToManyField(Category,blank=False)
    first_bid = models.DecimalField(max_digits=6, decimal_places=2,blank=False)#in dollars
    location = models.CharField(max_length=50,blank=False)
    latitude = models.DecimalField(max_digits=8, decimal_places=6,blank=True,null=True,
        validators=[
            MaxValueValidator(90),
            MinValueValidator(-90)
        ])
    longitude = models.DecimalField(max_digits=9, decimal_places=6,blank=True,null=True,
        validators=[
            MaxValueValidator(180),
            MinValueValidator(-180)
        ])
    country = models.CharField(max_length=50,blank=False)
    started = models.DateTimeField(blank=False)
    ends = models.DateTimeField(blank=False)
    description = models.CharField(max_length=500,blank=True)

    seller =  models.ForeignKey(AppUser, related_name='auctions', on_delete=models.CASCADE,blank=False)

class AuctionImage(models.Model):
    def __str__(self):
        return os.path.basename(self.image.name) + " (" + str(self.auction.pk) + ")" 
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["order", "auction"], name="unique_image_order")
        ]

    auction = models.ForeignKey(Auction, related_name='images', on_delete=models.CASCADE,blank=False)
    image = models.ImageField(upload_to='auction_images' ,blank=False)
    order = models.IntegerField(blank=False,default=1,validators=[MinValueValidator(1)])


class Bid(models.Model):
    def set_bidder(self,bidder_id):
        self.bidder=AppUser.objects.get(pk=bidder_id)
    def set_auction(self,auction_id):
        self.auction=Auction.objects.get(pk=auction_id)

    #pk = id
    time =  models.DateTimeField(blank=False)
    amount = models.DecimalField(max_digits=6, decimal_places=2,blank=False)#in dollars

    auction = models.ForeignKey(Auction, related_name='bids', on_delete=models.CASCADE,blank=False)
    bidder = models.ForeignKey(AppUser, related_name='bids', on_delete=models.CASCADE,blank=False)