from rest_framework import permissions

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