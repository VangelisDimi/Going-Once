from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import lxml.etree as ET
from utils.renderers import CustomJSONRenderer,CustomXMLRenderer

from .serializers import AuctionSerializer
from utils.permissions import IsAdmin, IsAppUser
from .models import Auction, Bid

class CreateAuctionView(APIView):
    permission_classes = [IsAuthenticated & IsAppUser]

    def post(self, request):
        serializer = AuctionSerializer(data=request.data,context = {'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

class ExportXMLView(APIView):
    renderer_classes = (CustomXMLRenderer,)
    permission_classes = [IsAuthenticated & IsAdmin]
    
    def get(self,request):
        root = ET.Element("Item", ItemID="1")
        doc = ET.SubElement(root, "doc")

        ET.SubElement(doc, "field1", name="blah").text = "some value1"
        ET.SubElement(doc, "field", name="asdfasd").text = "some vlaue2"

        return Response(root,content_type='application/xml')

class ExportJSONView(APIView):
    renderer_classes = (CustomJSONRenderer,)
    permission_classes = [IsAuthenticated & IsAdmin]

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