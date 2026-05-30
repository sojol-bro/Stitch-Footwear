from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from decimal import Decimal
from shop.models import Product, Order, OrderItem, Review, Message, NewsletterSubscription

class ProductAPITestCase(APITestCase):
    def setUp(self):
        self.product1 = Product.objects.create(
            custom_id="1",
            name="Aero-Stitch V1",
            price=Decimal("149.00"),
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
            hover_image="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000",
            category="Outdoor",
            gender="Men",
            inventory={"38": 10, "42": 20},
            status="Live"
        )
        self.product2 = Product.objects.create(
            custom_id="ST-002",
            name="Cloud-Walk Retro",
            price=Decimal("129.50"),
            image="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000",
            category="Performance",
            gender="Women",
            inventory={"39": 15},
            status="Hidden"
        )

    def test_list_products(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        # Verify snake_case to camelCase field serialization
        p1_data = next(item for item in response.data if item['custom_id'] == "1")
        self.assertEqual(p1_data['price_display'], "$149")
        self.assertEqual(p1_data['hoverImage'], self.product1.hover_image)
        self.assertTrue(p1_data['isNew'] is False or p1_data['isNew'] is None) # defaults
        self.assertEqual(p1_data['status'], "Live")

        p2_data = next(item for item in response.data if item['custom_id'] == "ST-002")
        self.assertEqual(p2_data['price_display'], "$129.50")
        self.assertEqual(p2_data['status'], "Hidden")

    def test_retrieve_product_by_pk(self):
        url = reverse('product-detail', kwargs={'pk': self.product1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Aero-Stitch V1")

    def test_retrieve_product_by_custom_id(self):
        # Retrieve using string ID e.g. "ST-002"
        url = reverse('product-detail', kwargs={'pk': 'ST-002'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Cloud-Walk Retro")

    def test_create_product_success_and_defaults(self):
        url = reverse('product-list')
        payload = {
            "name": "Zenith Alpha Runner",
            "price": 180.00,
            "category": "Athletic",
            "inventory": {"42": 15}
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Zenith Alpha Runner")
        # Assert auto-generated custom_id and default image fallback logic
        self.assertTrue(response.data['custom_id'].startswith("ST-"))
        self.assertEqual(response.data['image'], "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000")
        self.assertEqual(response.data['status'], "Live")

    def test_update_product_partial(self):
        url = reverse('product-detail', kwargs={'pk': 'ST-002'})
        payload = {
            "status": "Live",
            "inventory": {"39": 10}
        }
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product2.refresh_from_db()
        self.assertEqual(self.product2.status, "Live")
        self.assertEqual(self.product2.inventory["39"], 10)


class OrderAPITestCase(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            custom_id="1",
            name="Aero-Stitch V1",
            price=Decimal("149.00"),
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
            category="Outdoor",
            gender="Men",
            inventory={"42": 10, "43": 5}
        )

    def test_checkout_and_inventory_decrement(self):
        url = reverse('order-list')
        payload = {
            "name": "Jane Doe",
            "phone": "01712-345678",
            "address": "Banani, Dhaka",
            "city": "Dhaka",
            "subtotal": 149.00,
            "shipping_cost": 5.00,
            "final_total": 154.00,
            "payment_method": "online",
            "selected_mfs": "bKash",
            "mfs_number": "01712345678",
            "trx_id": "BKX93710A",
            "items": [
                {
                    "id": "1",
                    "name": "Aero-Stitch V1",
                    "price": "$149.00",
                    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
                    "size": "42",
                    "quantity": 2
                }
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)
        
        # Verify values stored properly
        order = Order.objects.first()
        self.assertEqual(order.name, "Jane Doe")
        self.assertEqual(order.subtotal, Decimal("149.00"))
        self.assertEqual(order.payment_method, "online")
        self.assertEqual(order.trx_id, "BKX93710A")
        
        order_item = OrderItem.objects.first()
        self.assertEqual(order_item.price, Decimal("149.00"))
        self.assertEqual(order_item.size, "42")
        self.assertEqual(order_item.quantity, 2)

        # Assert inventory decremented correctly (10 - 2 = 8)
        self.product.refresh_from_db()
        self.assertEqual(self.product.inventory["42"], 8)
        self.assertEqual(self.product.inventory["43"], 5)  # untouched size


class DashboardAndCRMTestCase(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            custom_id="1",
            name="Aero-Stitch V1",
            price=Decimal("149.00"),
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
            category="Outdoor",
            gender="Men"
        )
        self.order = Order.objects.create(
            name="Tanvir Ahmed",
            phone="+8801712345678",
            address="Dhanmondi, Dhaka",
            city="Dhaka",
            subtotal=Decimal("240.00"),
            shipping_cost=Decimal("5.00"),
            final_total=Decimal("245.00"),
            payment_method="online",
            selected_mfs="bKash",
            status="Delivered"
        )
        self.order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            product_name="Aero-Stitch V1",
            price=Decimal("240.00"),
            size="42",
            quantity=1
        )

    def test_dashboard_stats(self):
        url = reverse('dashboard-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('revenue', response.data)
        self.assertEqual(response.data['revenue_raw'], 245.00)
        self.assertEqual(response.data['new_customers'], 1)

    def test_crm_customers(self):
        url = reverse('crm-customers')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Tanvir Ahmed")
        self.assertEqual(response.data[0]['orders_count'], 1)
        self.assertEqual(response.data[0]['total_spend'], 245.00)


class InteractionsAPITestCase(APITestCase):
    def test_create_review(self):
        product = Product.objects.create(
            custom_id="1",
            name="Aero-Stitch V1",
            price=Decimal("149.00"),
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
            category="Outdoor",
            gender="Men"
        )
        url = reverse('review-list')
        payload = {
            "product": product.id,
            "reviewer_name": "Reviewer Pro",
            "rating": 5,
            "comment": "Perfect boots!"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        self.assertEqual(Review.objects.first().reviewer_name, "Reviewer Pro")

    def test_create_message(self):
        url = reverse('message-list')
        payload = {
            "name": "Curious Shopper",
            "email": "curious@example.com",
            "subject": "Sizing Question",
            "message": "Do these run small?"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)

    def test_create_subscription(self):
        url = reverse('subscription-list')
        payload = {
            "email": "subscriber@example.com"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NewsletterSubscription.objects.count(), 1)
