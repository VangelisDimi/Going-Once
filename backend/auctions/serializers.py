from asyncore import write
from pyexpat import model
from rest_framework import serializers
from .models import Auction,AuctionImage,Category,Bid

from datetime import datetime
import pytz

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name')

class BidSerializer(serializers.ModelSerializer):
    id = serializers.CharField(write_only=True)

    class Meta:
        model = Bid
        fields = ('time','amount','id')
        extra_kwargs = {
            'time':{'read_only': True}
        }
    def create(self, validated_data):
        auction_id = validated_data.pop('id')
        now = datetime.now(pytz.UTC)
        instance = self.Meta.model(**validated_data)
        instance.set_bidder(self.context['request'].user.pk)
        instance.set_auction(auction_id)
        instance.time = now

        auction=Auction.objects.get(pk=auction_id)
        if instance.amount <= auction.get_current_bid():
            raise serializers.ValidationError(
                "Bid must be higher than current bid."
            )
        if instance.bidder.pk == auction.get_current_bidder_id():
            raise serializers.ValidationError(
                "You can't bid two times in a row."
            )
        instance.save()
        return instance

class AuctionSerializer(serializers.ModelSerializer):
    category = serializers.ListField(write_only=True)
    image = serializers.ListField(write_only=True,required=False)

    class Meta:
        model = Auction

        fields = ('pk','name','first_bid','location','latitude','longitude','country',
        'started','ends','description','category','image','seller_id')
        extra_kwargs = {
            'pk':{'read_only': True},
            'seller_id':{'read_only': True}
        }

    def create(self, validated_data):
        categories = validated_data.pop('category', [])
        images = validated_data.pop('image',[])
        instance = self.Meta.model(**validated_data)
        instance.set_seller(self.context['request'].user.pk)
        instance.save()
        for category in categories:
            category_instance, created = Category.objects.get_or_create(name=category)
            instance.category.add(category_instance)

        count = 1
        for img in images:
            AuctionImage.objects.create(auction=instance,image=img,order=count)
            count+=1
        return instance
    
    def update(self, instance, validated_data):
        categories = validated_data.pop('category', [])
        if len(categories)==0:
            raise serializers.ValidationError(
                "Auction must have at least one category."
            )
        images = validated_data.pop('image',[])

        instance.name = validated_data.get('name', instance.name)
        instance.first_bid = validated_data.get('first_bid', instance.first_bid)
        instance.location = validated_data.get('location', instance.location)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.country = validated_data.get('country', instance.country)
        instance.started = validated_data.get('started', instance.started)
        instance.ends = validated_data.get('ends', instance.ends)
        instance.description = validated_data.get('description', instance.description)

        instance.category.clear()
        for category in categories:
            category_instance, created = Category.objects.get_or_create(name=category)
            instance.category.add(category_instance)

        # To-do : update images

        instance.save()
        return instance