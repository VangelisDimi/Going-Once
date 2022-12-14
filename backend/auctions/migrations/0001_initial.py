# Generated by Django 4.1 on 2022-09-02 20:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0011_alter_appuser_options_alter_baseuser_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Auction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('first_bid', models.DecimalField(decimal_places=2, max_digits=7)),
                ('location', models.CharField(max_length=50)),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=8)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9)),
                ('country', models.CharField(max_length=50)),
                ('started', models.DateTimeField(blank=True)),
                ('ends', models.DateTimeField(blank=True)),
                ('description', models.CharField(blank=True, max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=150)),
            ],
        ),
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('auction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bids', to='auctions.auction')),
                ('bidder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bids', to='users.appuser')),
            ],
        ),
        migrations.AddField(
            model_name='auction',
            name='categories',
            field=models.ManyToManyField(to='auctions.category'),
        ),
        migrations.AddField(
            model_name='auction',
            name='seller',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='auctions', to='users.appuser'),
        ),
    ]
