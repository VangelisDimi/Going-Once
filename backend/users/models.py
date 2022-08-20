from django.db import models
from django.contrib.auth.models import AbstractUser,PermissionsMixin

#Models
class BaseUser(AbstractUser):
    class Meta:
        pass

    #pk = id
    #Inherits: username,first_name,last_name,email,password,is_staff,
    #is_superuser
    #Inherited
    email = models.EmailField(blank=False)
    first_name = models.CharField(max_length=150,blank=False)
    last_name = models.CharField(max_length=150,blank=False)

    is_approved = models.BooleanField(default=False)

class AppUser(BaseUser):
    class Meta:
        pass
    
    #Added
    phone_number = models.CharField(max_length=50,blank=False)
    street_name = models.CharField(max_length=50,blank=False)
    street_number = models.CharField(max_length=50,blank=False)
    postal_code = models.CharField(max_length=30,blank=False)
    country = models.CharField(max_length=50,blank=False)
    location = models.CharField(max_length=50,blank=False)
    tin = models.CharField(max_length=50,blank=False)