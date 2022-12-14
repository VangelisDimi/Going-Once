# Generated by Django 4.1 on 2022-08-17 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_baseuser_is_superuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baseuser',
            name='is_superuser',
            field=models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status'),
        ),
    ]
