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