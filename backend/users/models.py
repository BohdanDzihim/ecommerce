from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
SELLER_TYPE_CHOICES = [
  ('private', 'Private'),
  ('business', 'Business'),
]

class User(AbstractUser):
  is_seller = models.BooleanField(default=False)
  email = models.EmailField(unique=True)

class CustomerProfile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
  image_url = models.URLField(blank=True, null=True)
  phone = models.CharField(max_length=15, blank=True, null=True)
  address = models.CharField(max_length=255, blank=True, null=True)
  postal_code = models.CharField(max_length=10, blank=True, null=True)
  city = models.CharField(max_length=25, blank=True, null=True)
  country = models.CharField(max_length=25, blank=True, null=True)

  def __str__(self):
    return self.user.username

class SellerProfile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
  seller_type = models.CharField(max_length=10, choices=SELLER_TYPE_CHOICES, default='private')
  shop_name = models.CharField(max_length=255, blank=True, null=True)
  address = models.CharField(max_length=255, blank=True, null=True)
  phone = models.CharField(max_length=15, blank=True, null=True)
  postal_code = models.CharField(max_length=10, blank=True, null=True)
  city = models.CharField(max_length=25, blank=True, null=True)
  country = models.CharField(max_length=25, blank=True, null=True)
  created_at = models.DateField(auto_now_add=True)
  verified = models.BooleanField(default=False)
  description = models.TextField(max_length=1000, blank=True, null=True)
  logo_url = models.URLField(blank=True, null=True)

  def __str__(self):
    return self.user.username
