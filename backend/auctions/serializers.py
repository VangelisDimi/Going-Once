from rest_framework import serializers
from .models import Auction,Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name')

class AuctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auction
        tag = CategorySerializer(many=True)

        fields = ('name','first_bid','location','latitude','longitude','country',
        'started','ends','description')
    
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance