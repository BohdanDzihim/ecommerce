from django.urls import path
from . import views

urlpatterns = [
    path('presign/', views.GeneratePresignedUrl.as_view(), name='generate-presigned-url'),
    path('delete/', views.DeleteS3FileView.as_view(), name='delete-s3-file'),
]
