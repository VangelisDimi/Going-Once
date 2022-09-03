from rest_framework import serializers
from .models import Auction,Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name')

class AuctionSerializer(serializers.ModelSerializer):
    # category = CategorySerializer(many=True)
    category = serializers.ListField(write_only=True)

    class Meta:
        model = Auction

        fields = ('name','first_bid','location','latitude','longitude','country',
        'started','ends','description','category')

    def create(self, validated_data):
        categories = validated_data.pop('category', [])
        instance = self.Meta.model(**validated_data)
        instance.set_seller(self.context['request'].user.pk)
        instance.save()
        for category in categories:
            category_instance, created = Category.objects.get_or_create(name=category)
            instance.category.add(category_instance)
        return instance