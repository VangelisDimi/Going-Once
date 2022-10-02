from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import lxml.etree as ET
from utils.renderers import CustomJSONRenderer,CustomXMLRenderer
from rest_framework import generics

from users.models import AppUser
from users.serializers import UserSerializer
from .serializers import AuctionSerializer,BidSerializer
from utils.permissions import IsAdmin, IsAppUser, IsApproved, OwnsAuction, EditAuction, ActiveAuction
from .models import Auction, Bid, Category,AuctionImage

from datetime import datetime
import pytz

class CreateAuctionView(APIView):
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved]

    def post(self, request):
        serializer = AuctionSerializer(data=request.data,context = {'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

class UpdateAuction(APIView):
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved & OwnsAuction & EditAuction]

    def patch(self,request):
        auction=Auction.objects.get(pk=request.data['id'])
        serializer = AuctionSerializer(auction,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

class AddBid(APIView):
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved & ~OwnsAuction & ActiveAuction]

    def post(self, request):
        serializer = BidSerializer(data=request.data,context={'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)
        

class ExportXMLView(APIView):
    renderer_classes = (CustomXMLRenderer,)
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]
    
    def get(self,request):
        id = request.GET.get('id')
        auction = Auction.objects.get(pk=id)
        auction_categories = auction.category.all()
        auction_bids = Bid.objects.filter(auction=auction)

        root = ET.Element("Item", ItemID=str(auction.pk))
        ET.SubElement(root, "Name").text = auction.name
        for category in auction_categories:
            ET.SubElement(root, "Category").text = category.name

        ET.SubElement(root, "Currently").text = "$"+str(auction.get_current_bid())
        ET.SubElement(root,"First_Bid").text = "$"+str(auction.first_bid)
        ET.SubElement(root,"Number_of_Bids").text = str(auction_bids.count())

        bids = ET.SubElement(root, "Bids")
        for auction_bid in auction_bids:
            auction_bidder = auction_bid.bidder

            bid = ET.SubElement(bids, "Bid")
            bidder = ET.SubElement(bid, "Bidder", Rating=str(auction_bidder.get_rating()), UserId=auction_bidder.username)
            ET.SubElement(bidder,"Location").text = auction_bidder.location
            ET.SubElement(bidder,"Country").text = auction_bidder.country
            
            ET.SubElement(bid,"Time").text = str(auction_bid.time)
            ET.SubElement(bid,"Amount").text = "$"+str(auction_bid.amount)

        ET.SubElement(root, "Location").text = auction.location
        ET.SubElement(root, "Country").text = auction.country
        ET.SubElement(root, "Started").text = str(auction.started)
        ET.SubElement(root, "Ends").text = str(auction.ends)
        ET.SubElement(root,"Seller",Rating=str(auction.seller.get_rating()),UserID=auction.seller.username)
        ET.SubElement(root,"Description").text = auction.description

        return Response(root,content_type='application/xml')

class ExportJSONView(APIView):
    renderer_classes = (CustomJSONRenderer,)
    permission_classes = [IsAuthenticated & IsAdmin & IsApproved]

    def get(self,request):
        id = request.GET.get('id')

        data = {}
        item = {}
        bids = []
        categories = []

        auction = Auction.objects.get(pk=id)
        auction_categories = auction.category.all()
        auction_bids = Bid.objects.filter(auction=auction)

        item['ItemID'] = auction.pk
        item['Name'] = auction.name

        for category in auction_categories:
            categories.append(category.name)
        item['Categories'] = categories

        item['Currently'] = "$"+str(auction.get_current_bid())
        item['First_Bid'] = "$"+str(auction.first_bid)
        item['Number_of_Bids'] = auction_bids.count()
        
        for auction_bid in auction_bids:
            bid = {}
            auction_bidder = auction_bid.bidder
            bidder = {}
            bidder['Rating']=auction_bidder.get_rating()
            bidder['UserID']=auction_bidder.username
            bidder['Location']=auction_bidder.location
            bidder['Country']=auction_bidder.country
            bid['Bidder']=bidder
            bid['Time']=str(auction_bid.time)
            bid['Amount']="$"+str(auction_bid.amount)

            bids.append(bid)
        item['Bids'] = bids

        item['Location'] = auction.location
        item['Country']  = auction.country
        item['Started'] = str(auction.started)
        item['Ends'] = str(auction.ends)

        seller = {}
        seller['Rating'] = auction.seller.get_rating()
        seller['UserID'] = auction.seller.username
        item['Seller'] = seller

        item['Description'] = auction.description

        data['Item'] = item
        return Response(data,content_type='application/json')

class GetAuction(APIView):
    def get(self,request):
        id = request.GET.get('id')

        auction=Auction.objects.get(pk=id)
        auction_serializer = AuctionSerializer(auction).data

        if request.user.is_authenticated:
            if auction_serializer['seller_id'] == request.user.pk:
                auction_serializer['own_auction'] = True
            else: 
                auction_serializer['own_auction'] = False

            if auction.get_current_bidder_id() == request.user.pk:
                auction_serializer['own_bid'] = True
            else:
                auction_serializer['own_bid'] = False
        else:
            auction_serializer['own_auction'] = False
            auction_serializer['own_bid'] = False

        seller_serializer = UserSerializer(auction.seller)
        auction_serializer['seller_username'] = seller_serializer.data['username']

        auction_categories = auction.category.all().values('pk','name')
        auction_serializer['categories'] = auction_categories

        auction_serializer['status']=auction.get_status()

        auction_serializer['current_bid']=auction.get_current_bid()
        auction_bids = Bid.objects.filter(auction=auction).values('time','amount','pk','bidder_id').order_by('-time')
        auction_serializer['num_bids']=len(auction_bids)
        if auction_serializer['own_auction'] or (request.user.is_authenticated and request.user.is_staff):
            for bid in auction_bids:
                bid_object=Bid.objects.get(pk=bid['pk'])
                bidder_serializer = UserSerializer(bid_object.bidder)
                bid['bidder_username'] = bidder_serializer.data['username']
            auction_serializer['bids'] = auction_bids

        auction_images = AuctionImage.objects.filter(auction=auction).values('image','order')
        auction_serializer['images'] = auction_images

        return Response(auction_serializer)

class GetAuctionsManage(generics.ListAPIView):
    queryset = Auction.objects.all().values('pk','name','first_bid','location','latitude','longitude','country',
    'started','ends','description','seller_id').order_by('started')
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved]

    def list(self,request):
        now = datetime.now(pytz.UTC)

        auction_queryset = self.get_queryset().filter(seller_id=request.user.pk).exclude(ends__lte=now)
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
            auction_bids = Bid.objects.filter(auction=auction)
            item['num_bids'] = len(auction_bids)

            auction_images = AuctionImage.objects.filter(auction=auction).values('image','order')
            item['images'] = auction_images

        return self.get_paginated_response(data)

class GetAuctionsNavigate(generics.ListAPIView):
    queryset = Auction.objects.all().order_by('started')

    def list(self,request):
        #Filter queryset
        now = datetime.now(pytz.UTC)

        auction_queryset = self.get_queryset().exclude(ends__lte=now)
        if request.user.is_authenticated:
            auction_queryset=auction_queryset.exclude(seller_id=request.user.pk)

        parent_category = request.GET.get('parent_category')
        if parent_category:
            auction_queryset = auction_queryset.filter(category__name=parent_category)
        categories = request.GET.getlist('category')
        if len(categories) > 0:
            auction_queryset = auction_queryset.filter(category__name__in=categories).distinct()
        location = request.GET.get('location')
        if location:
            auction_queryset= auction_queryset.filter(location=location)
        description =request.GET.get('description')
        if description:
            auction_queryset=auction_queryset.filter(description=description)
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        filtered = auction_queryset
        for object in auction_queryset:
            if min_price and not (object.get_current_bid()>=int(min_price)):
                filtered = filtered.exclude(pk=object.pk)
            elif max_price and not  (object.get_current_bid()<=int(max_price)):
                filtered = filtered.exclude(pk=object.pk)

        #Create response
        auction_page = self.paginate_queryset(filtered.values('pk','name','first_bid','location','latitude','longitude','country',
        'started','ends','description','seller_id'))
        data = list(auction_page)
        for item in data:
            auction = Auction.objects.get(pk=item['pk'])

            if request.user.is_authenticated:
                if auction.get_current_bidder_id() == request.user.pk:
                    item['own_bid'] = True
                else:
                    item['own_bid'] = False
            else:
                item['own_bid'] = False

            seller_serializer = UserSerializer(auction.seller)
            item['seller_username'] = seller_serializer.data['username']

            auction_categories = auction.category.all().values('pk','name')
            item['categories'] = auction_categories

            item['status']=auction.get_status()

            item['current_bid']=auction.get_current_bid()
            auction_bids = Bid.objects.filter(auction=auction)
            item['num_bids'] = len(auction_bids)

            auction_images = AuctionImage.objects.filter(auction=auction).values('image','order')
            item['images'] = auction_images

        return self.get_paginated_response(data)

class DeleteAuction(APIView):
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved & OwnsAuction & EditAuction] 

    def delete(self,request):
        auction=Auction.objects.get(pk=request.data['id'])
        auction.delete()

        return Response(status=status.HTTP_200_OK)

class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all().values('pk','name').order_by('name')

    def list(self,request):
        response = self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(response)