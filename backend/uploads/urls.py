from django.urls import path
from . import views

urlpatterns = [
    path('presign/', views.GeneratePresignedUrl.as_view(), name='generate-presigned-url'),
]
