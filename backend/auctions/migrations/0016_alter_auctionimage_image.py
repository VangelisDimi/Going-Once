# Generated by Django 4.1 on 2022-09-16 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0015_alter_auctionimage_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auctionimage',
            name='image',
            field=models.ImageField(upload_to=''),
        ),
    ]
