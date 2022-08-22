from rest_framework import permissions

class IsAppUser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_staff:
            return True
        return False