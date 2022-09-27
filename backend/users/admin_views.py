from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

from .serializers import AdminSerializer,UserSerializer
from django.core import exceptions
from rest_framework import serializers
from .models import AppUser, BaseUser
from utils.permissions import IsAdmin,IsApproved

from rest_framework.authentication import BasicAuthentication
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics

#Admin
class RegisterView(APIView):
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

class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated & IsAdmin]

class UsersListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]
    queryset = AppUser.objects.all().values('pk','username','first_name','last_name','email','is_approved',
    'phone_number','street_name','street_number','postal_code','country','location','tin').order_by('pk')
    def list(self,request):
        response = self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(response)

class AdminsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]
    queryset = BaseUser.objects.filter(is_staff = True).values('pk','username','first_name','last_name','email','is_approved','is_superuser').order_by('pk')

    def list(self,request):
        queryset = self.get_queryset().exclude(pk=request.user.pk)
        response = self.paginate_queryset(queryset)
        return self.get_paginated_response(response)

class ApproveUserView(APIView):
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]

    def patch(self,request):
        user = BaseUser.objects.get(pk=request.data['user_id'])
        user.is_approved = True
        user.save()
        return Response(status=status.HTTP_200_OK)