from .models import SellerProfile, CustomerProfile
from .serializers import UserSerializer, CustomerProfileSerializer, SellerProfileSerializer, RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny

# Create your views here.
class ProfileView(APIView):
  def get(self, request):
    user = request.user
    customer_profile = CustomerProfile.objects.filter(user=user).first()
    seller_profile = SellerProfile.objects.filter(user=user).first()

    data = {
      "user": UserSerializer(user).data,
      "customer_profile": CustomerProfileSerializer(customer_profile).data
    }

    if seller_profile:
      data["seller_profile"] = SellerProfileSerializer(seller_profile).data

    return Response(data)
  
class EditProfileView(APIView):
  def patch(self, request):
    user = request.user

    user_data = request.data.get("user", {})
    user_serializer = UserSerializer(user, data=user_data, partial=True)
    if not user_serializer.is_valid():
      return Response(user_serializer.errors, status=400)
    user_serializer.save()

    customer_data = request.data.get("customer_profile", {})
    customer_profile = getattr(user, "customer_profile", None)
    if customer_profile:
      customer_serializer = CustomerProfileSerializer(customer_profile, data=customer_data, partial=True)
      if not customer_serializer.is_valid():
        return Response(customer_serializer.errors, status=400)
      customer_serializer.save()

    # update SellerProfile fields (only if user is_seller)
    seller_data = request.data.get("seller_profile", {})
    seller_profile = getattr(user, 'seller_profile', None)
    if user.is_seller:
      if not seller_profile:
        seller_profile = SellerProfile.objects.create(user=user)
      
      seller_serializer = SellerProfileSerializer(seller_profile, data=seller_data, partial=True)
      if not seller_serializer.is_valid():
        return Response(seller_serializer.errors, status=400)
      seller_serializer.save()

    return Response({"message": "Profile updated successfully",
                    "user": UserSerializer(user).data,
                    "customerProfile": CustomerProfileSerializer(customer_profile).data,
                    "sellerProfile": SellerProfileSerializer(seller_profile).data}, status=200)

class MyObtainTokenPairView(TokenObtainPairView):
  serializer_class = MyTokenObtainPairSerializer
  permission_classes = [AllowAny]

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)

    try:
      serializer.is_valid(raise_exception=True)
    except Exception as e:
      return Response({"detail": "Invalid credentials"}, status=401)
    
    user = serializer.user
    username = user.username
    access_token = serializer.validated_data.get("access")
    refresh_token = serializer.validated_data.get("refresh")

    response = Response({"message": "Login successful", 
                         "username": username, 
                         "access_token": access_token, 
                         "refresh_token": refresh_token}, status=200)

    response.set_cookie(
      key='access_token',
      value=access_token,
      httponly=True,
      secure=True,
      samesite='None',
    )

    response.set_cookie(
      key='refresh_token',
      value=refresh_token,
      httponly=True,
      secure=True,
      samesite='None',
    )

    return response

class RegisterView(generics.CreateAPIView):
  permission_classes = [AllowAny]
  serializer_class = RegisterSerializer

  def post(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    response = Response({
      "message": "Successful registation",
      "user": UserSerializer(user).data,
      "refresh": str(refresh),
      "access": str(refresh.access_token),
    }, status=201)

    response.set_cookie(
      key='access_token',
      value=refresh.access_token,
      httponly=True,
      secure=True,
      samesite='None',
    )

    response.set_cookie(
      key='refresh_token',
      value=refresh,
      httponly=True,
      secure=True,
      samesite='None',
    )

    return response
  
class CustomTokenRefreshView(TokenRefreshView):
  def post(self, request, *args, **kwargs):
    refresh_token = request.COOKIES.get("refresh_token")

    if not refresh_token:
      return Response({"error": "No refresh token in cookies"}, status=400)

    data = request.data.copy()
    data["refresh"] = refresh_token
    request._full_data = data

    response = super().post(request, *args, **kwargs)
    
    if response.status_code == 200:
      access_token = response.data.get("access")
      response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="None",
      )

      refresh_token = response.data.get("refresh")
      response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="None"
      )

    return response

class LogoutView(APIView):
  def post(self, request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
      return Response({"detail": "Refresh token is missing"}, status=400)
    
    try:
      token = RefreshToken(refresh_token)
      token.blacklist()
    except Exception as e:
      pass

    response = Response({"message": "Logout successful"}, status=200)
    response.delete_cookie("access_token", samesite="None")
    response.delete_cookie("refresh_token", samesite="None")
    return response
    
class LogoutAllView(APIView):
  def post(self, request):
    tokens = OutstandingToken.objects.filter(user_id=request.user.id)
    for token in tokens:
      t, _ = BlacklistedToken.objects.get_or_create(token=token)
    return Response(status=205)
