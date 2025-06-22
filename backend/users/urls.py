from django.urls import path
from . import views

urlpatterns = [
  path('login/', views.MyObtainTokenPairView.as_view(), name='token-obtain-pair'),
  path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token-refresh'),
  path('logout/', views.LogoutView.as_view(), name='logout'),
  path('logout_all/', views.LogoutAllView.as_view(), name='logout-all'),
  path('register/', views.RegisterView.as_view(), name='register'),
  path('profile/', views.ProfileView.as_view(), name='profile'),
  path('profile/edit/', views.EditProfileView.as_view(), name='edit'),
]
