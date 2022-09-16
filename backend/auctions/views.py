from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import lxml.etree as ET
from utils.renderers import CustomJSONRenderer,CustomXMLRenderer
from django.core.paginator import Paginator

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

class GetAuctionsManage(APIView):
    permission_classes = [IsAuthenticated & IsAppUser & IsApproved]

    def get(self,request):
        auction_list = Auction.objects.filter(seller_id=request.user.pk).values('pk','name','first_bid','location','latitude','longitude','country',
        'started','ends','description','seller_id').order_by('-pk')

        items = request.GET.get('items')
        paginator = Paginator(auction_list, items)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        data = list(page_obj)
        for item in data:
            auction = Auction.objects.get(pk=item['pk'])

            seller_serializer = UserSerializer(auction.seller)
            item['seller_username'] = seller_serializer.data['username']

            auction_categories = auction.category.all().values('pk','name')
            item['categories'] = auction_categories

            auction_bids = Bid.objects.filter(auction=auction).values('time','amount','pk','bidder_id')
            for bid in auction_bids:
                # bidder = AppUser.objects.get(bid.bidder)
                bidder_serializer = UserSerializer(bid.bidder)
                bid['bidder_username'] = bidder_serializer.data['username']
            item['bids'] = auction_bids

            auction_images = AuctionImage.objects.filter(auction=auction).values('image','order')
            item['images'] = auction_images

        res_data = {}
        res_data['num_pages'] = paginator.num_pages
        res_data['items'] = data
        return Response(res_data)