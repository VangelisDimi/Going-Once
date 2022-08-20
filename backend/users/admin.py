from django.contrib import admin
from .models import AppUser,BaseUser

# Register your models here.
admin.site.register(AppUser)
admin.site.register(BaseUser)