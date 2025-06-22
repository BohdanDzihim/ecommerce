from rest_framework.test import APITestCase, APIClient
from users.models import User, SellerProfile, CustomerProfile
from django.urls import reverse
from .models import Order

# Create your tests here.
class CartTests(APITestCase):
  def setUp(self):
    self.client = APIClient()

    self.user = User.objects.create_user(
      username='seller',
      email='seller@seller.com',
      password='password123',
      is_seller=True
    )

    self.seller_profile = SellerProfile.objects.create(
      user=self.user
    )

    self.customer_profile = CustomerProfile.objects.create(
      user=self.user,
      phone="+1-202-555-0143",
      address="742 Evergreen Terrace",
      postal_code = "90210",
      city = "Springfield",
      country = "USA"
    )

    url = reverse('token-obtain-pair')
    response = self.client.post(url, {
      'username': self.user.username,
      'password': 'password123'
    }, format='json')
    
    self.access_token = response.data['access_token']
    
    self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
    
    self.product_data = {
      "user": self.seller_profile.id,
      "name": "iPhone 16 Pro",
      "price": "1199.99",
      "description": "iPhone 16 Pro 256GB",
      "category": "phones"
    }

  def product_create_and_add(self):
    url_create = reverse('product-create')
    response_create = self.client.post(url_create, self.product_data, format='json')
    url_add = reverse('cart-add')
    response_add = self.client.post(url_add, { 'product_id': response_create.data['id'] }, format='json')
    return response_create, url_add, response_add

  def cart_get(self):
    url_get = reverse('cart')
    response_get = self.client.get(url_get)
    return response_get
  
  def test_checkout(self):
    self.product_create_and_add()
    url_checkout = reverse('checkout')
    response_checkout = self.client.post(url_checkout)
    self.assertEqual(response_checkout.status_code, 201)

    response_get = self.cart_get()
    self.assertEqual(len(response_get.data['items']), 0)
    self.assertEqual(len(Order.objects.all()), 1)
    order = Order.objects.first()
    self.assertEqual(order.items.count(), 1)
    self.assertEqual(order.user_id, self.user.id)

    response_empty = self.client.post(url_checkout)
    self.assertEqual(response_empty.status_code, 400)

    self.product_create_and_add()

    self.user.customer_profile.address = ''
    self.user.customer_profile.save()

    response_invalid_profile = self.client.post(url_checkout)
    self.assertEqual(response_invalid_profile.status_code, 400)

    self.client.logout()
    response_unauth = self.client.post(url_checkout)
    self.assertEqual(response_unauth.status_code, 401)
    