from users.models import User, CustomerProfile, SellerProfile
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ("id", "username", "first_name", "last_name", "email", "is_seller")

class CustomerProfileSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)

  class Meta:
    model = CustomerProfile
    fields = "__all__"

class SellerProfileSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)

  class Meta:
    model = SellerProfile
    fields = "__all__"

class RegisterSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)

  class Meta: 
    model = User
    fields = ("username", "email", "password", "password2", "is_seller")

  def validate(self, attrs):
    if attrs["password"] != attrs["password2"]:
      raise serializers.ValidationError({"password": "Password field didn't match"})
    return attrs

  def create(self, validated_data):
    password = validated_data.pop('password')
    validated_data.pop('password2')

    user = User.objects.create(**validated_data)
    CustomerProfile.objects.create(user=user)
    if validated_data.get('is_seller'):
      SellerProfile.objects.create(user=user)
    user.set_password(password)
    user.save()

    return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)

    token['username'] = user.username
    
    return token