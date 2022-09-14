from rest_framework import serializers
from .models import Auction,AuctionImage,Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name')

class AuctionSerializer(serializers.ModelSerializer):
    category = serializers.ListField(write_only=True)
    image = serializers.ListField(write_only=True,required=False)

    class Meta:
        model = Auction

        fields = ('name','first_bid','location','latitude','longitude','country',
        'started','ends','description','category','image')

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