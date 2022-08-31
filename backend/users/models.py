from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

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

class seller_rating(models.Model):
    rating_from = models.ForeignKey(AppUser, related_name='seller_rating_from', on_delete=models.CASCADE,blank=False)
    rating_to = models.ForeignKey(AppUser, related_name='seller_rating_to', on_delete=models.CASCADE,blank=False)
    rating = models.IntegerField(validators=[
            MaxValueValidator(10),
            MinValueValidator(0)
        ], blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["seller_rating_from", "seller_rating_to"], name="unique_keys_seller_rating")
    ]

class bider_rating(models.Model):
    rating_from = models.ForeignKey(AppUser, related_name='bider_rating_from', on_delete=models.CASCADE,blank=False)
    rating_to = models.ForeignKey(AppUser, related_name='bider_rating_to', on_delete=models.CASCADE,blank=False)
    rating = models.IntegerField(validators=[
            MaxValueValidator(100),
            MinValueValidator(1)
        ], blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["bider_rating_from", "bider_rating_to"], name="unique_keys_bider_rating")
    ]