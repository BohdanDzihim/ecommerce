from rest_framework.views import APIView
from rest_framework.response import Response
from store.models import Product
from .models import CartItem
from store.serializers import ProductSerializer
from django.shortcuts import get_object_or_404

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

class GetCartView(APIView):
  def get(self, request):
    items = CartItem.objects.filter(user=request.user).order_by('id')
    cart_data = []
    total_price = 0
    total_quantity = 0

    for item in items:
      total = item.get_total_price()
      total_price += total
      total_quantity += item.quantity
      cart_data.append({
        "product": ProductSerializer(item.product).data,
        "quantity": item.quantity,
        "total_price": total
      })

    return Response({
      "items": cart_data,
      "total_quantity": total_quantity,
      "total_price": total_price
    })

class AddToCartView(APIView):
  def post(self, request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))
    product = get_object_or_404(Product, id=product_id)

    item, created = CartItem.objects.get_or_create(
      user=request.user,
      product=product,
      defaults={"quantity": quantity}
    )

    if not created:
      item.quantity += quantity
      item.save()

    return Response({"message": "Product added",
                     "product": ProductSerializer(product).data,
                     "quantity": item.quantity})
  
class ClearCartView(APIView):
  def delete(self, request):
    CartItem.objects.filter(user=request.user).delete()
    serialized_items, total_price, total_quantity = get_user_cart_data(request.user)
    return Response({"message": "Cart cleared",
                     "items": serialized_items,
                     "total_price": total_price,
                     "total_quantity": total_quantity})

class IncreaseAmountCartView(APIView):
  def patch(self, request):
    product_id = request.data.get("product_id")
    try:
      product = get_object_or_404(Product, id=product_id)
    except:
      return Response({"message": "The product is not found"}, status=404)

    item = CartItem.objects.get(user=request.user, product=product)
    item.quantity += 1
    item.save()

    serialized_items, total_price, total_quantity = get_user_cart_data(request.user)

    return Response({
      "message": "The product was increased by 1",
      "product": ProductSerializer(item.product).data,
      "items": serialized_items,
      "total_price": total_price,
      "total_quantity": total_quantity
    }, status=200)

class DecreaseAmountCartView(APIView):
  def patch(self, request):
    product_id = request.data.get("product_id")

    try:
      product = get_object_or_404(Product, id=product_id)
    except:
      return Response({"message": "The product is not found"}, status=404)
    
    try:
        item = CartItem.objects.get(user=request.user, product=product)
    except CartItem.DoesNotExist:
        return Response({"message": "This item is not in your cart"}, status=404)
    
    item.quantity -= 1
    if item.quantity < 1:
      item.delete()
    else:
      item.save()
    
    serialized_items, total_price, total_quantity = get_user_cart_data(request.user)

    return Response({
      "message": "The product was decreased by 1",
      "product": ProductSerializer(item.product).data,
      "items": serialized_items,
      "total_price": total_price,
      "total_quantity": total_quantity
    }, status=200)

class UpdateCartView(APIView):
  def patch(self, request):
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity")
    try:
      quantity = int(quantity)
      if quantity <= 0:
        raise ValueError
    except (ValueError, TypeError):
      return Response({"message": "Invalid quantity"}, status=400)

    product = get_object_or_404(Product, id=product_id)

    try:
      item = CartItem.objects.get(user=request.user, product=product)
      item.quantity = quantity
      item.save()
    except CartItem.DoesNotExist:
      return Response({"error": "Item not in cart"}, status=404)
    
    serialized_items, total_price, total_quantity = get_user_cart_data(request.user)

    return Response({
      "message": "Cart updated",
      "product": ProductSerializer(product).data,
      "quantity": quantity,
      "items": serialized_items,
      "total_quantity": total_quantity,
      "total_price": total_price
    })

class RemoveProductInCartView(APIView):
  def delete(self, request):
    product_id = request.data.get("product_id")
    product = get_object_or_404(Product, id=product_id)
    deleted_count, _ = CartItem.objects.filter(user=request.user, product=product).delete()
    if deleted_count == 0:
      return Response({"message": "Product was not in the cart"}, status=404)
    
    serialized_items, total_price, _ = get_user_cart_data(request.user)

    return Response({"message": "The product is successfully deleted from cart",
                     "removed_product": ProductSerializer(product).data,
                     "items": serialized_items,
                     "total_price": total_price}, status=200)
