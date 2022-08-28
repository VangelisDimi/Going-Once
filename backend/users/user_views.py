from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

from .serializers import UserSerializer
from django.core import exceptions
from rest_framework import serializers
from .models import AppUser
from utils.permissions import IsAppUser,IsApproved

from rest_framework.authentication import BasicAuthentication
from knox.views import LoginView as KnoxLoginView

#Users
class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved]

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

class GetPersonalView(APIView):
    permission_classes = [IsAuthenticated & IsAppUser]

    def get(self,request):
        user = AppUser.objects.get(pk=request.user.pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

class DeleteView(APIView):
    permission_classes = [IsAuthenticated & IsAppUser]

    def delete(self,request):
        user = AppUser.objects.get(pk=request.user.pk)
        confirm_password = request.data.get('password')
        if not user.check_password(confirm_password):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        user.delete()

        return Response(status=status.HTTP_200_OK)