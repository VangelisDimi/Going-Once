from rest_framework import serializers
from .models import BaseUser, AppUser

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
        model = BaseUser

        fields = ('pk','username','first_name','last_name','email','password',
        )
        extra_kwargs = {'password': {'write_only': True}}
        optional_fields = []
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.is_staff=True
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        password = validated_data.pop('password', None)
        if password is not None:
                instance.set_password(password)

        instance.save()
        return instance


#Used to create initial admin
class SuperAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = ('pk','username','password',
        )
        extra_kwargs = {'password': {'write_only': True}}
        optional_fields = []
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.is_staff=True
        instance.is_superuser = True
        instance.is_approved = True
        instance.save()
        return instance