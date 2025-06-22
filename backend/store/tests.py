from rest_framework.test import APITestCase, APIClient
from users.models import User, SellerProfile, CustomerProfile
from store.models import Product
from django.urls import reverse

# Create your tests here.
class ProductAPITests(APITestCase):
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
  
  def create_new_user(self):
    second_user = User.objects.create_user(
        username='seller2',
        email='seller2@seller.com',
        password='password123',
        is_seller=True
    )
    SellerProfile.objects.create(user=second_user)

    url_login = reverse('token-obtain-pair')
    response_login = self.client.post(url_login, {
        'username': 'seller2',
        'password': 'password123'
    }, format='json')
    token = response_login.data['access_token']
    self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

  def test_product_create(self):
    url = reverse('product-create')
    response_create = self.client.post(url, self.product_data, format='json')
    self.assertEqual(response_create.status_code, 201)
    self.assertEqual(response_create.data['name'], self.product_data['name'])
    self.assertEqual(Product.objects.count(), 1)

    response_invalid = self.client.post(url, {}, format='json')
    self.assertEqual(response_invalid.status_code, 400)

    self.client.logout()
    response_unauth = self.client.post(url, self.product_data, format='json')
    self.assertEqual(response_unauth.status_code, 401)

  def test_product_delete_success(self):
    url_create = reverse('product-create')
    response_create = self.client.post(url_create, self.product_data, format='json')
    url_delete = reverse('product-delete', args=[response_create.data['id']])
    response_delete = self.client.delete(url_delete)
    self.assertEqual(response_delete.status_code, 204)
    self.assertEqual(Product.objects.count(), 0)
    self.assertFalse(Product.objects.filter(id=response_create.data['id']).exists())

  def test_product_delete_forbidden(self):
    url_create = reverse('product-create')
    response_create = self.client.post(url_create, self.product_data, format='json')
    url_delete = reverse('product-delete', args=[response_create.data['id']])

    self.create_new_user()

    response_delete = self.client.delete(url_delete)
    self.assertEqual(response_delete.status_code, 403)

    self.client.logout()
    response_delete = self.client.delete(url_delete)
    self.assertEqual(response_delete.status_code, 401)

  def test_product_update_success(self):
    url_create = reverse('product-create')
    response_create = self.client.post(url_create, self.product_data, format='json')
    url_update = reverse('product-update', args=[response_create.data['id']])
    response_update = self.client.patch(url_update, {'name': 'iPhone 16'}, format='json')
    self.assertEqual(response_update.data['product']['name'], 'iPhone 16')
    self.assertEqual(response_update.status_code, 200)

  def test_product_update_invalid_data(self):
    response_create = self.product_create_and_add()[0]
    url_update = reverse('product-update', args=[response_create.data['id']])
    response_update = self.client.patch(url_update, {'price': -100}, format='json')
    self.assertEqual(response_update.status_code, 400)

    response_update = self.client.patch(url_update, {'name': ''}, format='json')
    self.assertEqual(response_update.status_code, 400)
    
  def test_product_update_forbidden(self):
    response_create = self.product_create_and_add()[0]
    url_update = reverse('product-update', args=[response_create.data['id']])
    self.client.logout()
    response_update = self.client.patch(url_update, {'name': 'iPhone 16 Pro'}, format='json')
    self.assertEqual(response_update.status_code, 401)

    self.create_new_user()
    
    response_update = self.client.patch(url_update, {'name': 'Hacked'}, format='json')
    self.assertEqual(response_update.status_code, 403)

  def test_product_detail(self):
    url_create = reverse('product-create')
    response_create = self.client.post(url_create, self.product_data, format='json')
    url_detail = reverse('product-detail', args=[response_create.data['id']])
    response_detail = self.client.get(url_detail)
    self.assertEqual(response_detail.status_code, 200)
    self.assertEqual(response_detail.data['name'], 'iPhone 16 Pro')

    url_invalid = reverse('product-detail', args=[99999])
    response = self.client.get(url_invalid)
    self.assertEqual(response.status_code, 404)

    self.client.logout()
    response_detail = self.client.get(url_detail)
    self.assertEqual(response_detail.status_code, 200)

  def test_search(self):
    self.product_create_and_add()
    url = reverse('product-search')
    response = self.client.get(url + '?search=iPhone')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.data), 1)
    self.assertEqual(response.data[0]['name'], 'iPhone 16 Pro')

    response_invalid = self.client.get(url + '?search=Samsung')
    self.assertEqual(response_invalid.status_code, 200)
    self.assertEqual(len(response_invalid.data), 0)

