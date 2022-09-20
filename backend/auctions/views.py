from operator import truediv
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import lxml.etree as ET
from utils.renderers import CustomJSONRenderer,CustomXMLRenderer
from rest_framework import generics

from users.models import AppUser
from users.serializers import UserSerializer
from .serializers import AuctionSerializer
from utils.permissions import IsAdmin, IsAppUser, IsApproved
from .models import Auction, Bid, Category,AuctionImage

class CreateAuctionView(APIView):
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved]

    def post(self, request):
        serializer = AuctionSerializer(data=request.data,context = {'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

class ExportXMLView(APIView):
    renderer_classes = (CustomXMLRenderer,)
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]
    
    def get(self,request):
        root = ET.Element("Item", ItemID="1")
        doc = ET.SubElement(root, "doc")

        ET.SubElement(doc, "field1", name="blah").text = "some value1"
        ET.SubElement(doc, "field", name="asdfasd").text = "some vlaue2"

        return Response(root,content_type='application/xml')

class ExportJSONView(APIView):
    renderer_classes = (CustomJSONRenderer,)
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]

    def get(self,request):
        data = {}
        item = {}
        bids = []
        categories = []

        auction = Auction.objects.get(pk=request.data.get('auction_id'))
        auction_categories = auction.category.all()
        auction_bids = Bid.objects.filter(auction=auction)

        item['ItemID'] = auction.pk
        item['Name'] = auction.name

        for category in auction_categories:
            categories.append(category.name)
        item['Categories'] = categories

        item['Currently'] = auction.get_current_bid()
        item['First_Bid'] = "$"+str(auction.first_bid)
        item['Number_of_Bids'] = auction_bids.count()
        
        for bid in bids:
            bidder = bid.bidder
            pass
        item['Bids'] = bids

        item['Location'] = auction.location
        item['Country']  = auction.country
        item['Description'] = auction.description

        data['Item'] = item
        return Response(data,content_type='application/json')

class GetAuction(APIView):
    def get(self,request):
        id = request.GET.get('id')

        auction=Auction.objects.get(pk=id)
        auction_serializer = AuctionSerializer(auction).data

        if auction_serializer['seller_id'] == request.user.pk:
            auction_serializer['own_auction'] = True
        else: auction_serializer['own_auction'] = False

        seller_serializer = UserSerializer(auction.seller)
        auction_serializer['seller_username'] = seller_serializer.data['username']

        auction_categories = auction.category.all().values('pk','name')
        auction_serializer['categories'] = auction_categories

        auction_serializer['status']=auction.get_status()

        auction_serializer['current_bid']=auction.get_current_bid()
        if auction_serializer['own_auction']:
            auction_bids = Bid.objects.filter(auction=auction).values('time','amount','pk','bidder_id')
            for bid in auction_bids:
                bidder_serializer = UserSerializer(bid.bidder)
                bid['bidder_username'] = bidder_serializer.data['username']
            auction_serializer['bids'] = auction_bids

        auction_images = AuctionImage.objects.filter(auction=auction).values('image','order')
        auction_serializer['images'] = auction_images

        return Response(auction_serializer)

class GetAuctionsManage(generics.ListAPIView):
    queryset = Auction.objects.all().values('pk','name','first_bid','location','latitude','longitude','country',
    'started','ends','description','seller_id').order_by('-pk')
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved]

    def list(self,request):
        auction_queryset = self.get_queryset().filter(seller_id=request.user.pk)
        auction_page = self.paginate_queryset(auction_queryset)

        data = list(auction_page)
        for item in data:
            auction = Auction.objects.get(pk=item['pk'])

            seller_serializer = UserSerializer(auction.seller)
            item['seller_username'] = seller_serializer.data['username']

            auction_categories = auction.category.all().values('pk','name')
            item['categories'] = auction_categories

            item['status']=auction.get_status()

            item['current_bid']=auction.get_current_bid()
            auction_bids = Bid.objects.filter(auction=auction).values('time','amount','pk','bidder_id')
            for bid in auction_bids:
                bidder_serializer = UserSerializer(bid.bidder)
                bid['bidder_username'] = bidder_serializer.data['username']
            item['bids'] = auction_bids

            auction_images = AuctionImage.objects.filter(auction=auction).values('image','order')
            item['images'] = auction_images

        return self.get_paginated_response(data)