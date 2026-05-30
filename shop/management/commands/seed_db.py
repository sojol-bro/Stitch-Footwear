from django.core.management.base import BaseCommand
from shop.models import Product
from decimal import Decimal
import datetime

class Command(BaseCommand):
    help = 'Seeds the database with initial footwear catalog products'

    def handle(self, *args, **options):
        # Initial products list matching src/constants/products.ts
        initial_products = [
            {
                "id": "1",
                "name": "Aero-Stitch V1",
                "price": Decimal("149.00"),
                "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
                "hover_image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000",
                "color": "bg-brand-teal",
                "category": "Outdoor",
                "gender": "Men",
                "description": "Engineered for the urban explorer, the Aero-Stitch V1 combines retro aesthetics with modern performance. Featuring our signature recycled mesh and algae-based cushioning.",
                "specs": ["Recycled Ocean Plastic", "Algae Midsoles", "Zero-Waste Knit", "Carbon Neutral"],
                "date_released": datetime.date(2024, 3, 15),
                "is_new": True,
                "is_coming_soon": False,
                "inventory": { "38": 10, "39": 15, "40": 20, "41": 25, "42": 20, "43": 15, "44": 10, "45": 9 }
            },
            {
                "id": "2",
                "name": "Cloud-Walk Retro",
                "price": Decimal("129.00"),
                "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000",
                "hover_image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000",
                "color": "bg-brand-lavender",
                "category": "Performance",
                "gender": "Women",
                "description": "Step into the clouds with our most comfortable silhouette yet. The Cloud-Walk Retro uses high-density memory foam and a breathable upper for all-day wear.",
                "specs": ["Memory Foam", "Breathable Mesh", "Lightweight Build", "Eco-Friendly"],
                "date_released": datetime.date(2024, 2, 20),
                "is_new": True,
                "is_coming_soon": False,
                "inventory": { "38": 12, "39": 10, "40": 8, "41": 15, "42": 15, "43": 10, "44": 5, "45": 5 }
            },
            {
                "id": "3",
                "name": "Neon-Pulse Low",
                "price": Decimal("159.00"),
                "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000",
                "hover_image": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=1000",
                "color": "bg-brand-lilac",
                "category": "Lifestyle",
                "gender": "Unisex",
                "description": "Vibrant energy meets precision engineering. The Neon-Pulse Low is designed for those who want to stand out without compromising on comfort or durability.",
                "specs": ["High-Vis Accents", "Durable Sole", "Precision Fit", "Sustainable"],
                "date_released": datetime.date(2024, 1, 10),
                "is_new": False,
                "is_coming_soon": False,
                "inventory": { "38": 5, "39": 8, "40": 10, "41": 12, "42": 12, "43": 8, "44": 6, "45": 4 }
            },
            {
                "id": "4",
                "name": "Zenith Runner",
                "price": Decimal("179.00"),
                "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000",
                "hover_image": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=1000",
                "color": "bg-brand-teal",
                "category": "Athletic",
                "gender": "Men",
                "description": "The ultimate performance runner. Designed for speed and endurance.",
                "specs": ["Carbon Plate", "Responsive Foam", "Grip Tech", "Ultra Light"],
                "date_released": datetime.date(2024, 4, 1),
                "is_new": False,
                "is_coming_soon": True,
                "inventory": { "38": 0, "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0, "45": 0 }
            },
            {
                "id": "5",
                "name": "Velvet Strider",
                "price": Decimal("139.00"),
                "image": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000",
                "hover_image": "https://images.unsplash.com/photo-1512374382149-433a72b75d9b?auto=format&fit=crop&q=80&w=1000",
                "color": "bg-brand-lavender",
                "category": "Heels",
                "gender": "Women",
                "description": "Elegant and comfortable heels for any formal occasion.",
                "specs": ["Soft Velvet", "Cushioned Insole", "Stable Heel", "Chic Design"],
                "date_released": datetime.date(2024, 3, 25),
                "is_new": True,
                "is_coming_soon": False,
                "inventory": { "38": 8, "39": 10, "40": 12, "41": 8, "42": 0, "43": 0, "44": 0, "45": 0 }
            },
            {
                "id": "6",
                "name": "Urban Nomad",
                "price": Decimal("119.00"),
                "image": "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&q=80&w=1000",
                "hover_image": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=1000",
                "color": "bg-brand-lilac",
                "category": "Sandals",
                "gender": "Women",
                "description": "Breathable and stylish sandals for summer adventures.",
                "specs": ["Adjustable Straps", "Contoured Footbed", "Water Friendly", "Recycled Materials"],
                "date_released": datetime.date(2024, 4, 10),
                "is_new": False,
                "is_coming_soon": True,
                "inventory": { "38": 15, "39": 15, "40": 10, "41": 10, "42": 5, "43": 5, "44": 0, "45": 0 }
            }
        ]

        self.stdout.write('Seeding products database...')
        
        for item in initial_products:
            prod_id = item.pop('id')
            # Ensure status is set to Live
            item['status'] = 'Live'
            # Update or create by custom_id
            product, created = Product.objects.update_or_create(
                custom_id=prod_id,
                defaults=item
            )
            status = 'created' if created else 'updated'
            self.stdout.write(self.style.SUCCESS(f'Successfully {status} product "{product.name}" with custom_id "{prod_id}"'))
        
        self.stdout.write(self.style.SUCCESS('Database seeding complete!'))
