from . import views
from django.urls import path

urlpatterns = [
  path('', views.GetCartView.as_view(), name='cart'),
  path('add/', views.AddToCartView.as_view(), name='cart-add'),
  path('update/', views.UpdateCartView.as_view(), name='cart-update'),
  path('remove/', views.RemoveProductInCartView.as_view(), name='cart-delete'),
  path('clear/', views.ClearCartView.as_view(), name='cart-clear'),
  path('decrease/', views.DecreaseAmountCartView.as_view(), name='cart-decrease'),
  path('increase/', views.IncreaseAmountCartView.as_view(), name='cart-increase'),
]
