from rest_framework import serializers
from .models import AppAdmin, AppUser

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser

        fields = ('pk','username','first_name','last_name','email','password',
        'phone_number','street_name','street_number','postal_code','country','location','tin')
        extra_kwargs = {'password': {'write_only': True}}
        optional_fields = []
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppAdmin

        fields = ('pk','username','first_name','last_name','email','password',
        )
        extra_kwargs = {'password': {'write_only': True}}
        optional_fields = []
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance