from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import uuid
import boto3

# Create your views here.
class GeneratePresignedUrl(APIView):
  def post(self, request):
    s3_client = boto3.client(
      's3',
      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
      region_name=settings.AWS_S3_REGION_NAME
    )
    
    file_name = f"{uuid.uuid4()}.{request.data.get('extension', 'jpg')}"
    bucket = settings.AWS_STORAGE_BUCKET_NAME

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
  
