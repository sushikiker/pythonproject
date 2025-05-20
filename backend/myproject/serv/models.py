from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    age = models.PositiveIntegerField(null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  
    paymentMethod = models.CharField(max_length=255)
    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField()
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('canceled', 'Отменен'),
    ]
    
    customer_email = models.EmailField()  # Поле для хранения email клиента
    products = models.ManyToManyField(Product)
    choosen_store = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Заказ {self.id} - {self.customer_email} ({self.get_status_display()})"


