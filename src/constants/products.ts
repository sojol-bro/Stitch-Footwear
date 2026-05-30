export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  hoverImage: string;
  color: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  description: string;
  specs: string[];
  dateReleased: string;
  isNew?: boolean;
  isComingSoon?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Aero-Stitch V1",
    price: "$149",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-teal",
    category: "Outdoor",
    gender: "Men",
    description: "Engineered for the urban explorer, the Aero-Stitch V1 combines retro aesthetics with modern performance. Featuring our signature recycled mesh and algae-based cushioning.",
    specs: ["Recycled Ocean Plastic", "Algae Midsoles", "Zero-Waste Knit", "Carbon Neutral"],
    dateReleased: "2024-03-15",
    isNew: true
  },
  {
    id: '2',
    name: "Cloud-Walk Retro",
    price: "$129",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000",
    hoverImage: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-lavender",
    category: "Performance",
    gender: "Women",
    description: "Step into the clouds with our most comfortable silhouette yet. The Cloud-Walk Retro uses high-density memory foam and a breathable upper for all-day wear.",
    specs: ["Memory Foam", "Breathable Mesh", "Lightweight Build", "Eco-Friendly"],
    dateReleased: "2024-02-20",
    isNew: true
  },
  {
    id: '3',
    name: "Neon-Pulse Low",
    price: "$159",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000",
    hoverImage: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-lilac",
    category: "Lifestyle",
    gender: "Unisex",
    description: "Vibrant energy meets precision engineering. The Neon-Pulse Low is designed for those who want to stand out without compromising on comfort or durability.",
    specs: ["High-Vis Accents", "Durable Sole", "Precision Fit", "Sustainable"],
    dateReleased: "2024-01-10"
  },
  {
    id: '4',
    name: "Zenith Runner",
    price: "$179",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1000",
    hoverImage: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-teal",
    category: "Athletic",
    gender: "Men",
    description: "The ultimate performance runner. Designed for speed and endurance.",
    specs: ["Carbon Plate", "Responsive Foam", "Grip Tech", "Ultra Light"],
    dateReleased: "2024-04-01",
    isComingSoon: true
  },
  {
    id: '5',
    name: "Velvet Strider",
    price: "$139",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000",
    hoverImage: "https://images.unsplash.com/photo-1512374382149-433a72b75d9b?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-lavender",
    category: "Heels",
    gender: "Women",
    description: "Elegant and comfortable heels for any formal occasion.",
    specs: ["Soft Velvet", "Cushioned Insole", "Stable Heel", "Chic Design"],
    dateReleased: "2024-03-25",
    isNew: true
  },
  {
    id: '6',
    name: "Urban Nomad",
    price: "$119",
    image: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&q=80&w=1000",
    hoverImage: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-lilac",
    category: "Sandals",
    gender: "Women",
    description: "Breathable and stylish sandals for summer adventures.",
    specs: ["Adjustable Straps", "Contoured Footbed", "Water Friendly", "Recycled Materials"],
    dateReleased: "2024-04-10",
    isComingSoon: true
  }
];
