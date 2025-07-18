from django.db import models
from users.models import CustomerProfile
from store.models import Product
# Create your models here.

class Order(models.Model):
  STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('paid', 'Paid'),
    ('shipped', 'Shipped'),
    ('cancelled', 'Cancelled'),
  ]
  user = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
  total_price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
  order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1)
  