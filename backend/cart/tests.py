from rest_framework.test import APITestCase, APIClient
from users.models import User, SellerProfile, CustomerProfile
from django.urls import reverse

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

  def test_add_product_to_cart(self):
    response_create, url_add, response_add = self.product_create_and_add()
    self.assertEqual(response_add.status_code, 200)
    self.assertEqual(response_add.data['product']['id'], response_create.data['id'])

    response_get = self.cart_get()
    self.assertEqual(response_get.status_code, 200)
    self.assertEqual(len(response_get.data['items']), 1)

    response_invalid = self.client.post(url_add, { 'product_id': 99999 }, format='json')
    self.assertEqual(response_invalid.status_code, 404)
    
    response_repeat = self.client.post(url_add, { 'product_id': response_create.data['id'] }, format='json')
    self.assertEqual(response_repeat.data['quantity'], 2)
    
    self.client.logout()
    response_unauth = self.client.post(url_add, { 'product_id': response_create.data['id'] }, format='json')
    self.assertEqual(response_unauth.status_code, 401)

  def test_cart_update_success(self):
    _, _, response_add = self.product_create_and_add()
    url_update = reverse('cart-update')
    response_update = self.client.patch(url_update, {'product_id': response_add.data['product']['id'], 'quantity': 16}, format='json')
    self.assertEqual(response_update.status_code, 200)
    self.assertEqual(response_update.data['quantity'], 16)

    response_update = self.client.patch(url_update, {'product_id': response_add.data['product']['id'], 'quantity': 2}, format='json')
    self.assertEqual(response_update.status_code, 200)
    self.assertEqual(response_update.data['quantity'], 2)

  def test_cart_update_invalid_data(self):
    _, _, response_add = self.product_create_and_add()
    url_update = reverse('cart-update')
    response_update = self.client.patch(url_update, {'product_id': response_add.data['product']['id'], 'quantity': -20}, format='json')
    self.assertEqual(response_update.status_code, 400)

    response_update = self.client.patch(url_update, {'product_id': 99999, 'quantity': 6}, format='json')
    self.assertEqual(response_update.status_code, 404)

  def test_cart_update_unauth(self):
    _, _, response_add = self.product_create_and_add()
    url_update = reverse('cart-update')
    self.client.logout()
    response_unauth = self.client.patch(url_update, {'product_id': response_add.data['product']['id'], 'quantity': 136}, format='json')
    self.assertEqual(response_unauth.status_code, 401)

  def test_cart_remove(self):
    response_create, url_add, response_add = self.product_create_and_add()
    
    url_remove = reverse('cart-delete')
    response_remove = self.client.delete(url_remove, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_remove.status_code, 200)

    response_remove = self.client.delete(url_remove, {'product_id': 99999}, format='json')
    self.assertEqual(response_remove.status_code, 404)
    
    response_add = self.client.post(url_add, {'product_id': response_create.data['id']}, format='json')
    self.client.logout()
    response_unauth = self.client.delete(url_remove, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_unauth.status_code, 401)

  def test_cart_clear(self):
    response_create, url_add, response_add = self.product_create_and_add()
    url_remove = reverse('cart-clear')
    response_remove = self.client.delete(url_remove, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_remove.status_code, 200)
    self.assertEqual(len(response_remove.data['items']), 0)
    self.assertEqual(response_remove.data['total_quantity'], 0)
    self.assertEqual(response_remove.data['total_price'], 0)
    
    response_get = self.cart_get()
    self.assertEqual(response_get.status_code, 200)
    self.assertEqual(len(response_get.data['items']), 0)

    response_add = self.client.post(url_add, {'product_id': response_create.data['id']}, format='json')
    self.client.logout()
    response_unauth = self.client.delete(url_remove, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_unauth.status_code, 401)

  def test_cart_increase_quantity(self):
    _, _, response_add = self.product_create_and_add()
    url_increase = reverse('cart-increase')
    response_increase = self.client.patch(url_increase, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_increase.status_code, 200)
    self.assertEqual(response_increase.data['total_quantity'], 2)

    self.client.logout()
    response_unauth = self.client.patch(url_increase, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_unauth.status_code, 401)

  def test_cart_decrease_quantity_to_zero(self):
    _, _, response_add = self.product_create_and_add()
    url_decrease = reverse('cart-decrease')
    response_decrease = self.client.patch(url_decrease, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_decrease.status_code, 200)
    self.assertEqual(response_decrease.data['total_quantity'], 0)

  def test_cart_decrease_quantity_empty_cart(self):
    _, _, response_add = self.product_create_and_add()
    response_get = self.cart_get()
    self.assertEqual(response_get.status_code, 200)
    self.assertEqual(len(response_get.data['items']), 1)

    url_decrease = reverse('cart-decrease')
    response_decrease = self.client.patch(url_decrease, {'product_id': response_add.data['product']['id']}, format='json')
    response_get = self.cart_get()
    self.assertEqual(response_get.status_code, 200)
    self.assertEqual(len(response_get.data['items']), 0)

    response_decrease = self.client.patch(url_decrease, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_decrease.status_code, 404)

    response_get = self.cart_get()
    self.assertEqual(response_get.status_code, 200)
    self.assertEqual(len(response_get.data['items']), 0)

  def test_cart_decrease_quantity_unauth(self):
    _, _, response_add = self.product_create_and_add()
    url_decrease = reverse('cart-decrease')
    self.client.logout()
    response_unauth = self.client.patch(url_decrease, {'product_id': response_add.data['product']['id']}, format='json')
    self.assertEqual(response_unauth.status_code, 401)
