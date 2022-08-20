from functools import partial
from operator import truediv
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.contrib.auth import get_user_model
from rest_framework import serializers

from users.serializers import SuperAdminSerializer,AdminSerializer
from users.models import BaseUser

from utils.query import query
from utils.json_read import get_secret


class Command(BaseCommand):
    help = 'Creates the initial admin of the app'

    def handle(self, *args, **options):
        username = "admin"
        admin_data =  {'username': "admin", 
                 'password':get_secret('ADMIN_PASSWORD')
                }

        try:
            User = BaseUser.objects.get(username = username)
        except:
            User = None
        #User Already exists
        if User:
            if User.is_superuser and User.is_staff:
                #Change password
                if query("User Already exists, would you like to change his password to the one given ?",default="no"):
                    serializer = AdminSerializer(User,data=admin_data,partial=True)
                    serializer.is_valid(raise_exception=True)
                    errors = dict() 
                    try:
                        validate_password(serializer.validated_data['password'],get_user_model())
                    except exceptions.ValidationError as exception:
                        errors['password'] = list(exception.messages)
                    if errors:
                        raise serializers.ValidationError(errors)

                    serializer.save()
                #Don't change password
                else:
                    return
            else:
                raise serializers.ValidationError("User Already exists and is not an superuser admin.")
        #Create Admin
        else:
            serializer = SuperAdminSerializer(data=admin_data)
            serializer.is_valid(raise_exception=True)
            errors = dict() 
            try:
                validate_password(serializer.validated_data['password'],get_user_model())
            except exceptions.ValidationError as exception:
                errors['password'] = list(exception.messages)
            if errors:
                raise serializers.ValidationError(errors)
            
            serializer.save()