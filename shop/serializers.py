from rest_framework import serializers
from .models import Product, Order, OrderItem, Review, Message, NewsletterSubscription

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='identifier', read_only=True)
    price_display = serializers.SerializerMethodField()
    image = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    hoverImage = serializers.URLField(source='hover_image', required=False, allow_null=True, allow_blank=True)
    dateReleased = serializers.DateField(source='date_released', required=False)
    isNew = serializers.BooleanField(source='is_new', required=False)
    isComingSoon = serializers.BooleanField(source='is_coming_soon', required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'custom_id', 'name', 'price', 'price_display', 
            'image', 'hoverImage', 'color', 'category', 'gender', 
            'description', 'specs', 'dateReleased', 'isNew', 
            'isComingSoon', 'inventory', 'status'
        ]

    def create(self, validated_data):
        # Auto generate custom_id if missing or blank
        if not validated_data.get('custom_id'):
            count = Product.objects.count()
            validated_data['custom_id'] = f"ST-{100 + count + 1}"
        
        # Supply a default fallback high-res sneaker image if not provided
        if not validated_data.get('image'):
            validated_data['image'] = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"
            
        # Ensure date_released is explicitly set as a date (not datetime) to prevent DRF formatting issues
        if not validated_data.get('date_released'):
            from django.utils import timezone
            validated_data['date_released'] = timezone.localdate()
            
        return super().create(validated_data)

    def get_price_display(self, obj):
        # Return format matching frontend: e.g. "$149" or "$149.00"
        # The frontend expects $ prefixed price string.
        # Let's round to integer if it ends with .00, else keep 2 decimals.
        val = obj.price
        if val % 1 == 0:
            return f"${int(val)}"
        return f"${val:.2f}"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'product', 'reviewer_name', 'rating', 'comment', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'price_display', 'image', 'size', 'quantity']

    def get_price_display(self, obj):
        val = obj.price
        if val % 1 == 0:
            return f"${int(val)}"
        return f"${val:.2f}"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_id = serializers.CharField(source='formatted_id', read_only=True)
    date_display = serializers.SerializerMethodField()
    total_display = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'name', 'email', 'phone', 'address', 'city',
            'subtotal', 'shipping_cost', 'final_total', 'payment_method',
            'selected_mfs', 'mfs_number', 'trx_id', 'status',
            'courier_name', 'tracking_id', 'created_at', 'date_display',
            'total_display', 'items'
        ]

    def get_date_display(self, obj):
        # Format date like 'Oct 12, 2023'
        return obj.created_at.strftime('%b %d, %Y')

    def get_total_display(self, obj):
        val = obj.final_total
        if val % 1 == 0:
            return f"${int(val)}"
        return f"${val:.2f}"

    def create(self, validated_data):
        # Extract items if passed (in write context)
        items_data = self.context.get('request').data.get('items', [])
        
        # Create order
        order = Order.objects.create(**validated_data)
        
        # Create order items
        for item_data in items_data:
            # item_data could contain product (id or object)
            # Find the product
            product_id = item_data.get('product') or item_data.get('id')
            product = None
            if product_id:
                try:
                    product = Product.objects.get(id=product_id)
                except (Product.DoesNotExist, ValueError):
                    try:
                        product = Product.objects.get(custom_id=product_id)
                    except Product.DoesNotExist:
                        pass

            price_raw = item_data.get('price', '0')
            # Strip '$' and convert to decimal
            if isinstance(price_raw, str):
                price_val = float(price_raw.replace('$', '').strip())
            else:
                price_val = float(price_raw)

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=item_data.get('name') or item_data.get('product_name') or (product.name if product else 'Unknown Product'),
                price=price_val,
                image=item_data.get('image') or (product.image if product else ''),
                size=item_data.get('size', 'One Size'),
                quantity=int(item_data.get('quantity', 1))
            )
            
            # Decrement inventory for product variant
            if product:
                size_str = str(item_data.get('size', ''))
                inventory = product.inventory or {}
                if size_str in inventory:
                    try:
                        current_stock = int(inventory[size_str])
                        qty = int(item_data.get('quantity', 1))
                        # Don't go below 0
                        inventory[size_str] = max(0, current_stock - qty)
                        product.inventory = inventory
                        product.save()
                    except (ValueError, TypeError):
                        pass

        return order


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'created_at']
