from rest_framework import serializers
from store.models import Product

class ProductSerializer(serializers.ModelSerializer):
  image_url = serializers.URLField(required=False, allow_null=True) #should be required later

  class Meta:
    model = Product
    fields = ("id", "user", "name", "price", "description", "image_url", "category")
    read_only_fields = ["user"]

  def update(self, instance, validated_data):
    if 'image_url' not in validated_data:
        validated_data['image_url'] = instance.image_url
    return super().update(instance, validated_data)