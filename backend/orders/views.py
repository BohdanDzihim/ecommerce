from rest_framework.response import Response
from .serializers import OrderSerializer, OrderItemSerializer
from .models import Order, OrderItem
from cart.models import CartItem
from rest_framework.views import APIView
from store.serializers import ProductSerializer
from store.models import Product

# Create your views here.
def get_user_cart_data(user):
    cart_items = CartItem.objects.filter(user=user).order_by('id')
    serialized_items = []
    total_price = 0
    total_quantity = 0

    for item in cart_items:
        product_data = ProductSerializer(item.product).data
        item_total = item.get_total_price()
        total_price += item_total
        total_quantity += item.quantity

        serialized_items.append({
            "product": product_data,
            "quantity": item.quantity,
            "price": item.product.price,
            "total_price": round(item_total, 2)
        })

    return serialized_items, round(total_price, 2), total_quantity

class Checkout(APIView):
  def post(self, request):
    
    serialized_items, total_price, _ = get_user_cart_data(request.user)

    if not serialized_items:
      return Response({"message": "The cart is empty, you cannot checkout"}, status=400)
    profile = request.user.customer_profile

    missing_fields = []
    if not profile.phone:
      missing_fields.append("phone")
    if not profile.address:
      missing_fields.append("address")
    if not profile.postal_code:
      missing_fields.append("postal_code")
    if not profile.city:
      missing_fields.append("city")
    if not profile.country:
      missing_fields.append("country")
    if missing_fields:
      if len(missing_fields) == 1:
        return Response({"message": f"The following field is missing in profile: {missing_fields}"}, status=400)
      else:
        return Response({"message": f"The following fields are missing in profile: {', '.join(missing_fields)}"}, status=400)

    order = Order.objects.create(
      user=request.user.customer_profile,
      total_price = total_price,
    )

    order_items = []
    for item in serialized_items:
      product_id = item["product"]["id"]
      product_instance = Product.objects.get(id=product_id)
      order_item = OrderItem.objects.create(order=order, product=product_instance, quantity=item["quantity"])
      order_items.append(order_item)

    CartItem.objects.filter(user=request.user).delete()
    return Response({"order": OrderSerializer(order).data, "orderItem": OrderItemSerializer(order_items, many=True).data}, status=201)
