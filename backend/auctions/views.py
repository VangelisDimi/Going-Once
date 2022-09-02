from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import AuctionSerializer
from utils.permissions import IsAppUser

class CreateAuctionView(APIView):
    permission_classes = [IsAuthenticated & IsAppUser]

    def post(self, request):
        serializer = AuctionSerializer(data=request.data,context = {'request':request})
        serializer.is_valid(raise_exception=True)

        # errors = dict() 
        # if errors:
        #     raise serializers.ValidationError(errors)
        
        # serializer.save()
        return Response(status=status.HTTP_201_CREATED)