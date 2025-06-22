from django.shortcuts import get_object_or_404
from rest_framework.response import Response
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
    seller_profile = self.request.user.seller_profile
    serializer.save(user=seller_profile)

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

class SearchView(generics.ListAPIView):
  permission_classes = [AllowAny]
  serializer_class = ProductSerializer

  def get_queryset(self):
    queryset = Product.objects.all()
    search = self.request.query_params.get("search")
    if search is not None:
      queryset = queryset.filter(
      Q(name__icontains=search) | Q(description__icontains=search)
    )

    return queryset
