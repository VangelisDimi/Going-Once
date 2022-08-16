from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

from .serializers import UserSerializer,AdminSerializer
from django.core import exceptions
from rest_framework import serializers

# Create your views here.
class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        errors = dict() 
        try:
            validate_password(serializer.validated_data['password'],get_user_model())
        except exceptions.ValidationError as exception:
            errors['password'] = list(exception.messages)
        if errors:
            raise serializers.ValidationError(errors)
        
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

class AdminRegisterView(APIView):
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        errors = dict() 
        try:
            validate_password(serializer.validated_data['password'],get_user_model())
        except exceptions.ValidationError as exception:
            errors['password'] = list(exception.messages)
        if errors:
            raise serializers.ValidationError(errors)
        
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    