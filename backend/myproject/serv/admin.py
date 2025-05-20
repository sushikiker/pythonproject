from django.contrib import admin
from .models import Product, Customer, Order

admin.site.register(Product)
admin.site.register(Customer)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_email', 'choosen_store', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('customer_email', 'choosen_store')