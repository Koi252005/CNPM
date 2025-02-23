from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_id', 'quantity', 'price', 'labs_activated')
        read_only_fields = ('price', 'labs_activated')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'customer', 'status', 'total_amount', 'shipping_address', 
                 'created_at', 'updated_at', 'items')
        read_only_fields = ('customer', 'status', 'total_amount')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(total_amount=0, **validated_data)
        
        total_amount = 0
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            price = product.price * item_data['quantity']
            total_amount += price
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                price=price
            )
        
        order.total_amount = total_amount
        order.save()
        return order 