from rest_framework import serializers
from .models import Product
from .models import Customer, Order
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "email", "password", "address", "age", "paymentMethod"]
        extra_kwargs = {"password": {"write_only": True}}


class OrderSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), many=True)
    customer_email = serializers.EmailField()

    class Meta:
        model = Order
        fields = ['id', 'customer_email', 'products', 'choosen_store', 'address', 'status', 'created_at']

    def create(self, validated_data):
        products = validated_data.pop('products')
        order = Order.objects.create(**validated_data)
        order.products.set(products)
        return order

