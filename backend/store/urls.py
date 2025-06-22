from . import views
from django.urls import path

urlpatterns = [
  path('', views.SearchView.as_view(), name='product-search'),
  path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
  path('create/', views.CreateProductView.as_view(), name='product-create'),
  path('update/<int:pk>/', views.UpdateProductView.as_view(), name='product-update'),
  path('delete/<int:pk>/', views.DeleteProductView.as_view(), name='product-delete'), 
]
