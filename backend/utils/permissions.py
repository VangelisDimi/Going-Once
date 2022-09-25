from rest_framework import permissions
from auctions.models import Auction,Bid
from users.models import AppUser

class IsAppUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_staff:
            return True
        return False

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return False

class IsApproved(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_approved:
            return True
        return False

class OwnsAuction(permissions.BasePermission):
    def has_permission(self, request, view):
        auction = Auction.objects.get(pk=request.data['id'])
        if request.user.pk==auction.seller.pk:
            return True
        return False

class EditAuction(permissions.BasePermission):
    def has_permission(self, request, view):
        auction = Auction.objects.get(pk=request.data['id'])

        if auction.get_status() == "pending" or (auction.get_status()=="active" and len(Bid.objects.filter(auction=auction))==0) :
            return True
        return False

class ActiveAuction(permissions.BasePermission):
    def has_permission(self, request, view):
        auction = Auction.objects.get(pk=request.data['id'])
        if auction.get_status() == "active":
            return True
        return False

class PasswordConfirm(permissions.BasePermission):
    def has_permission(self, request, view):
        user = AppUser.objects.get(pk=request.user.pk)
        confirm_password = request.data['password']
        if user.check_password(confirm_password):
            return True
        return False