from rest_framework import serializers
from store.models import Product

class ProductSerializer(serializers.ModelSerializer):
  image_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)
  is_owner = serializers.SerializerMethodField()

  class Meta:
    model = Product
    fields = ("id", "user", "name", "price", "description", "image_url", "category", "is_owner")
    read_only_fields = ["user", "id", "is_owner"]

  def update(self, instance, validated_data):
    if 'image_url' not in validated_data:
        validated_data['image_url'] = instance.image_url
    return super().update(instance, validated_data)
  
  def get_is_owner(self, obj):
    request = self.context.get('request')
    if request and hasattr(request, 'user'):
        return obj.user.user_id == request.user.id
    return False