from django.db import models
from django.contrib.auth.models import AbstractUser

class BaseUser(AbstractUser):
    #pk = id
    #Inherits: username,first_name,last_name,email,password,is_staff
    is_approved = models.BooleanField(default=False)

#Models
class AppUser(BaseUser):
    #Inherited
    AbstractUser.is_staff.value=False
    #Added
    phone_number = models.CharField(max_length=50)
    street_name = models.CharField(max_length=50)
    street_number = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=30)
    country = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    tin = models.CharField(max_length=50)

class AppAdmin(BaseUser):
    #Inherited
    AbstractUser.is_staff.value=False