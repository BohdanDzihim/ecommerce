# Generated by Django 5.2 on 2025-06-05 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_sellerprofile_seller_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customerprofile',
            name='address',
        ),
        migrations.RemoveField(
            model_name='customerprofile',
            name='city',
        ),
        migrations.RemoveField(
            model_name='customerprofile',
            name='country',
        ),
        migrations.RemoveField(
            model_name='customerprofile',
            name='image_url',
        ),
        migrations.RemoveField(
            model_name='customerprofile',
            name='phone',
        ),
        migrations.RemoveField(
            model_name='customerprofile',
            name='postal_code',
        ),
        migrations.RemoveField(
            model_name='sellerprofile',
            name='address',
        ),
        migrations.RemoveField(
            model_name='sellerprofile',
            name='city',
        ),
        migrations.RemoveField(
            model_name='sellerprofile',
            name='country',
        ),
        migrations.RemoveField(
            model_name='sellerprofile',
            name='logo_url',
        ),
        migrations.RemoveField(
            model_name='sellerprofile',
            name='phone',
        ),
        migrations.RemoveField(
            model_name='sellerprofile',
            name='postal_code',
        ),
        migrations.AddField(
            model_name='user',
            name='address',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='city',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='country',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='image_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='postal_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
