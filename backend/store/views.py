from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from store.serializers import ProductSerializer
from rest_framework import generics
from store.models import Product
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Q

# Create your views here.
class CreateProductView(generics.CreateAPIView):
  serializer_class = ProductSerializer

  def perform_create(self, serializer):
    user = self.request.user
    if not user.is_seller:
        raise PermissionDenied("You are not a seller")
    seller_profile = user.seller_profile
    serializer.save(user=seller_profile)

  def create(self, request, *args, **kwargs):
    response = super().create(request, *args, **kwargs)
    response.data = {
        "message": "Product is successfully created",
        "product": response.data
    }
    return response

class UpdateProductView(APIView):
  def patch(self, request, pk):
    product = get_object_or_404(Product, id=pk)

    if product.user.user_id != request.user.id:
      return Response({"message": "Forbidden"}, status=403)
    
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response({"message": "Product is successfully updated",
                       "product": serializer.data})
    return Response(serializer.errors, status=400)

class DeleteProductView(generics.RetrieveDestroyAPIView):
  def delete(self, request, pk):
    product = get_object_or_404(Product, id=pk)

    if product.user.user_id != request.user.id:
      return Response({"message": "Forbidden"}, status=403)
    
    product.delete()
    return Response({"message": "The product was successfully deleted"}, status=204)

class ProductDetailView(generics.RetrieveAPIView):
  permission_classes = [AllowAny]
  serializer_class = ProductSerializer
  queryset = Product.objects.all()

  def get_serializer_context(self):
    context = super().get_serializer_context()
    context['request'] = self.request
    return context

class MyProductListView(generics.ListAPIView):
  serializer_class = ProductSerializer
  
  def get_queryset(self):
    user = self.request.user
    if not user.is_seller:
      raise PermissionDenied("You are not a seller")
    
    try: 
      seller_profile = user.seller_profile
    except:
      raise PermissionDenied("Seller profile not found")
    return Product.objects.filter(user=seller_profile).order_by('-id')

class SearchView(generics.ListAPIView):
  permission_classes = [AllowAny]
  serializer_class = ProductSerializer

  def get_queryset(self):
    queryset = Product.objects.all().order_by('-id')
    search = self.request.query_params.get("search")
    if search is not None:
      queryset = queryset.filter(
      Q(name__icontains=search) | Q(description__icontains=search)
    )

    return queryset
