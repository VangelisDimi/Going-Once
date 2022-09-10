from rest_framework import serializers
from .models import BaseUser, AppUser

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser

        fields = ('username','first_name','last_name','email','password','is_staff',
        'phone_number','street_name','street_number','postal_code','country','location','tin','is_approved')
        extra_kwargs = {'password': {'write_only': True},
            'is_staff':{'read_only': True},
            'is_approved':{'read_only': True}
        }    
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
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
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.street_name = validated_data.get('street_name', instance.street_name)
        instance.street_number = validated_data.get('street_number', instance.street_number)
        instance.postal_code = validated_data.get('postal_code', instance.postal_code)
        instance.country = validated_data.get('country', instance.country)
        instance.location = validated_data.get('location', instance.location)
        instance.tin = validated_data.get('tin', instance.tin)

        instance.save()
        return instance

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseUser

        fields = ('username','first_name','last_name','email','password','is_staff',
        'is_approved')
        extra_kwargs = {'password':{'write_only': True},
            'is_staff':{'read_only': True},
            'is_approved':{'read_only': True}
        }

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
        fields = ('username','password')
        extra_kwargs = {'password': {'write_only': True}}

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