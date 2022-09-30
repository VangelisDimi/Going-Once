from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

from .serializers import AdminSerializer, UserSerializer
from django.core import exceptions
from rest_framework import serializers
from .models import AppUser, BaseUser
from utils.permissions import IsAdmin,IsAppUser,IsApproved

from rest_framework.authentication import BasicAuthentication
from knox.views import LoginView as KnoxLoginView

#Users
class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated & IsAppUser]

class RegisterView(APIView):
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

class PersonalUserInfoView(APIView):
    permission_classes = [IsAuthenticated & (IsAppUser | IsAdmin)]

    def get(self,request):
        base_user = BaseUser.objects.get(pk=request.user.pk)
        if base_user.is_staff:
            base_serializer = AdminSerializer(base_user)
            return Response(base_serializer.data)

        user = AppUser.objects.get(pk=request.user.pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)