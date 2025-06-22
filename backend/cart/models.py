from django.db import models
from store.models import Product
from users.models import User

# Create your models here.
class CartItem(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1)

  class Meta:
    unique_together = ('user', 'product')

  def get_total_price(self):
    return self.product.price * self.quantity
