from django.db import models
from django.utils import timezone

class Product(models.Model):
    GENDER_CHOICES = [
        ('Men', 'Men'),
        ('Women', 'Women'),
        ('Unisex', 'Unisex'),
    ]
    # We allow custom string ID (e.g., '1', 'ST-001') or automatic
    custom_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Store as numeric
    image = models.URLField(max_length=1000)
    hover_image = models.URLField(max_length=1000, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=100)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Unisex')
    description = models.TextField(blank=True, null=True)
    specs = models.JSONField(default=list, blank=True)
    date_released = models.DateField(default=timezone.now)
    is_new = models.BooleanField(default=False)
    is_coming_soon = models.BooleanField(default=False)
    inventory = models.JSONField(default=dict, blank=True) # Stock by size: {"38": 10, "39": 15...}
    status = models.CharField(max_length=50, default='Live')

    def __str__(self):
        return self.name

    @property
    def identifier(self):
        return self.custom_id or str(self.id)


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50)
    address = models.TextField()
    city = models.CharField(max_length=100)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    final_total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50) # 'online' or 'cod'
    selected_mfs = models.CharField(max_length=50, blank=True, null=True) # 'bKash', 'Nagad', 'Rocket'
    mfs_number = models.CharField(max_length=50, blank=True, null=True)
    trx_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    # Courier fields
    courier_name = models.CharField(max_length=100, blank=True, null=True)
    tracking_id = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} by {self.name}"

    @property
    def formatted_id(self):
        return f"#ORD-{9400 + self.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(max_length=1000, blank=True, null=True)
    size = models.CharField(max_length=50) # '42', 'One Size', etc.
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.product_name} (Size {self.size}) in Order #{self.order_id}"


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=255)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.reviewer_name} on {self.product.name}"


class Message(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"


class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
