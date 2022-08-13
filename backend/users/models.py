from django.db import models
from django.contrib.auth.models import AbstractUser

#Models
class AppUser(AbstractUser):
    # pk = id
    #Inherits: username,first_name,last_name,email,password,is_staff
    
    #Inherited
    first_name = models.CharField( max_length=150, blank=False)
    last_name = models.CharField(max_length=150, blank=False)
    email = models.EmailField(unique=True,blank=False)
    #Added
    phone_number = models.CharField(max_length=50)
    street_name = models.CharField(max_length=50)
    street_number = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=30)
    country = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    tin = models.CharField(max_length=50)
    is_approved = models.BooleanField(default=False)
