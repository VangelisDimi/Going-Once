# Generated by Django 4.1 on 2022-09-03 13:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0004_alter_auction_ends_alter_auction_started'),
    ]

    operations = [
        migrations.RenameField(
            model_name='auction',
            old_name='categories',
            new_name='category',
        ),
    ]
