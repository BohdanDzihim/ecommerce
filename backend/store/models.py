from django.db import models
from users.models import SellerProfile
from django.core.validators import MinValueValidator
from decimal import Decimal

# Create your models here.
class Product(models.Model):
  user = models.ForeignKey(SellerProfile, on_delete=models.CASCADE)
  name = models.CharField(max_length=255)
  price = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
  description = models.TextField(max_length=1000, blank=True, null=True)
  image_url = models.URLField(blank=True, null=True)
  category = models.CharField(max_length=100)

  def __str__(self):
    return self.name
