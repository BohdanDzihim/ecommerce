from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import uuid
import boto3
from urllib.parse import urlparse

# Create your views here.
class GeneratePresignedUrl(APIView):
  def post(self, request):
    allowed_extensions = ['jpg', 'jpeg', 'png', 'webp']
    allowed_content_types = ['image/jpeg', 'image/png', 'image/webp']

    extension = request.data.get('extension', 'jpg')
    content_type = request.data.get('content_type', 'image/jpeg')

    folder = request.data.get('folder', 'misc')
    allowed_folder = ['profile-images', 'product-images', 'seller-logos']

    if folder not in allowed_folder:
      return Response({'error': 'Invalid folder'}, status=400)

    if extension not in allowed_extensions or content_type not in allowed_content_types:
      return Response({'error': 'Invalid file type or content type'}, status=400)

    file_name = f"{folder}/{uuid.uuid4()}.{request.data.get('extension', 'jpg')}"
    bucket = settings.AWS_STORAGE_BUCKET_NAME

    s3_client = boto3.client(
      's3',
      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
      region_name=settings.AWS_S3_REGION_NAME
    )
    
    url = s3_client.generate_presigned_url(
      'put_object',
      Params={
        'Bucket': bucket, 
        'Key': file_name,
        'ContentType': request.data.get('content_type', 'image/jpeg')
      },
      ExpiresIn=300
    )

    return Response({
      'upload_url': url,
      'file_url': f"https://{bucket}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{file_name}"
    })
  
class DeleteS3FileView(APIView):
  def post(self, request):
    file_url = request.data.get('file_url')

    if not file_url:
      return Response({"error": "file_url is required"}, status=400)
    
    # Extract "key" from the url
    parsed_url = urlparse(file_url)
    key = parsed_url.path.lstrip('/')

    try:
      s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
      )

      s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
      
      return Response({'message': 'File deleted successfully'}, status=200)
    except Exception as e:
      return Response({"error": str(e)}, status=500)
