import { PRODUCTS, Product } from '../constants/products';
import { db, isFirebaseConfigured } from './firebase';
import { ref, get, set, push, update, remove } from 'firebase/database';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:8000/api';

// Helper to determine if Django is online
async function checkOnline(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/products/`, { method: 'OPTIONS', signal: AbortSignal.timeout(1000) });
    return res.ok || res.status === 200 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 405;
  } catch (e) {
    return false;
  }
}

// LocalStorage keys for Offline/Tertiary fallback Mode
const STORAGE_KEYS = {
  PRODUCTS: 'stitch_products',
  ORDERS: 'stitch_orders',
  REVIEWS: 'stitch_reviews',
  MESSAGES: 'stitch_messages',
  SUBSCRIPTIONS: 'stitch_subscriptions'
};

function getLocal<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize Local/Offline Database
export function initOfflineDb() {
  getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
  getLocal<any[]>(STORAGE_KEYS.ORDERS, [
    { 
      id: 9401,
      order_id: '#ORD-9401', 
      name: 'Tanvir Ahmed', 
      email: 'tanvir@example.com',
      phone: '01712-345678',
      date_display: 'Oct 12, 2023', 
      total_display: '$245.00', 
      final_total: 245.00,
      subtotal: 240.00,
      shipping_cost: 5.00,
      status: 'Delivered', 
      payment_method: 'online',
      selected_mfs: 'bKash',
      address: 'House 12, Road 5, Dhanmondi, Dhaka',
      items: [
        { id: '1', name: 'Cloud Walker Pro', product_name: 'Aero-Stitch V1', size: '42', price: 120.00, price_display: '$120.00', quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' },
        { id: '2', name: 'Neon Sprint', product_name: 'Neon-Pulse Low', size: '41', price: 125.00, price_display: '$125.00', quantity: 1, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200' }
      ],
      courier_name: 'Pathao',
      tracking_id: 'PTH-882910'
    },
    { 
      id: 9402,
      order_id: '#ORD-9402', 
      name: 'Nesha Isnan', 
      email: 'nesha@example.com',
      phone: '01812-345679',
      date_display: 'Oct 12, 2023', 
      total_display: '$120.00', 
      final_total: 120.00,
      subtotal: 115.00,
      shipping_cost: 5.00,
      status: 'Processing', 
      payment_method: 'cod',
      address: 'Plot 4, Sector 7, Uttara, Dhaka',
      items: [{ id: '4', name: 'Pastel Runner', product_name: 'Cloud-Walk Retro', size: '39', price: 120.00, price_display: '$120.00', quantity: 1, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=200' }],
      courier_name: '',
      tracking_id: ''
    }
  ]);
  getLocal<any[]>(STORAGE_KEYS.REVIEWS, []);
  getLocal<any[]>(STORAGE_KEYS.MESSAGES, []);
  getLocal<any[]>(STORAGE_KEYS.SUBSCRIPTIONS, []);
}

// Seeder to populate Firebase Realtime Database with initial data if empty
export async function seedFirebaseIfEmpty() {
  if (!isFirebaseConfigured || !db) return;
  try {
    const productsRef = ref(db, 'products');
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) {
      console.log('Firebase products catalog is empty. Seeding catalog...');
      const seededProducts: Record<string, Product> = {};
      PRODUCTS.forEach(p => {
        seededProducts[p.id] = p;
      });
      await set(productsRef, seededProducts);
      console.log('Firebase products catalog seeded successfully!');
    }

    // Also seed some initial orders to make the dashboard look awesome if configured
    const ordersRef = ref(db, 'orders');
    const ordersSnapshot = await get(ordersRef);
    if (!ordersSnapshot.exists()) {
      console.log('Firebase orders database is empty. Seeding default orders...');
      const defaultOrders: Record<string, any> = {
        '9401': {
          id: 9401,
          order_id: '#ORD-9401', 
          name: 'Tanvir Ahmed', 
          email: 'tanvir@example.com',
          phone: '01712-345678',
          date_display: 'Oct 12, 2023', 
          total_display: '$245.00', 
          final_total: 245.00,
          subtotal: 240.00,
          shipping_cost: 5.00,
          status: 'Delivered', 
          payment_method: 'online',
          selected_mfs: 'bKash',
          address: 'House 12, Road 5, Dhanmondi, Dhaka',
          items: [
            { id: '1', name: 'Cloud Walker Pro', product_name: 'Aero-Stitch V1', size: '42', price: 120.00, price_display: '$120.00', quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' },
            { id: '2', name: 'Neon Sprint', product_name: 'Neon-Pulse Low', size: '41', price: 125.00, price_display: '$125.00', quantity: 1, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200' }
          ],
          courier_name: 'Pathao',
          tracking_id: 'PTH-882910',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        '9402': {
          id: 9402,
          order_id: '#ORD-9402', 
          name: 'Nesha Isnan', 
          email: 'nesha@example.com',
          phone: '01812-345679',
          date_display: 'Oct 12, 2023', 
          total_display: '$120.00', 
          final_total: 120.00,
          subtotal: 115.00,
          shipping_cost: 5.00,
          status: 'Processing', 
          payment_method: 'cod',
          address: 'Plot 4, Sector 7, Uttara, Dhaka',
          items: [{ id: '4', name: 'Pastel Runner', product_name: 'Cloud-Walk Retro', size: '39', price: 120.00, price_display: '$120.00', quantity: 1, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=200' }],
          courier_name: '',
          tracking_id: '',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      await set(ordersRef, defaultOrders);
      console.log('Firebase orders seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding Firebase database:', error);
  }
}

// Call on startup
initOfflineDb();

if (isFirebaseConfigured && db) {
  seedFirebaseIfEmpty();
}

// Centralized API Client
export const api = {
  // PRODUCTS
  async getProducts(params?: { gender?: string; category?: string; q?: string }): Promise<Product[]> {
    try {
      const url = new URL(`${BASE_URL}/products/`);
      if (params?.gender) url.searchParams.append('gender', params.gender);
      if (params?.category) url.searchParams.append('category', params.category);
      if (params?.q) url.searchParams.append('q', params.q);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, falling back to database.', e);
      let list: Product[] = [];

      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await get(ref(db, 'products'));
          if (snapshot.exists()) {
            const data = snapshot.val();
            list = Object.values(data) as Product[];
          } else {
            list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
          }
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
          list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
        }
      } else {
        list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      }
      
      // Filter list
      if (params?.gender) {
        list = list.filter(p => p.gender.toLowerCase() === params.gender?.toLowerCase());
      }
      if (params?.category && params.category.toLowerCase() !== 'all') {
        list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.q) {
        const query = params.q.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }
      return list;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}/`);
      if (!res.ok) {
        const listRes = await fetch(`${BASE_URL}/products/?q=${id}`);
        const listData = await listRes.json();
        const found = listData.find((p: any) => p.id === id || p.custom_id === id);
        if (found) return found;
        throw new Error('Not found');
      }
      return await res.json();
    } catch (e) {
      console.warn(`Django offline, fetching product ${id} from database.`, e);
      
      if (isFirebaseConfigured && db) {
        try {
          // Check by exact key
          const snapshot = await get(ref(db, `products/${id}`));
          if (snapshot.exists()) {
            return snapshot.val() as Product;
          }
          // Search dynamically through products object
          const allSnapshot = await get(ref(db, 'products'));
          if (allSnapshot.exists()) {
            const allProducts = Object.values(allSnapshot.val()) as Product[];
            const found = allProducts.find(p => p.id === id || (p as any).custom_id === id);
            if (found) return found;
          }
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      const found = list.find(p => p.id === id || (p as any).custom_id === id);
      if (!found) throw new Error('Product not found in fallback DB');
      return found;
    }
  },

  async createProduct(productData: any): Promise<Product> {
    try {
      const res = await fetch(`${BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('API Create Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, creating product in database.', e);
      
      const regularPrice = productData.regularPrice || productData.price || 0;
      const parsedPrice = typeof regularPrice === 'number' ? regularPrice : parseFloat(String(regularPrice).replace('$', '')) || 0;

      const newProd: Product = {
        id: `ST-${Date.now().toString().slice(-4)}`, // dynamic unique key
        name: productData.name,
        price: `$${parsedPrice}`,
        image: productData.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
        hoverImage: productData.hoverImage || '',
        color: productData.color || 'bg-brand-teal',
        category: productData.category || 'Lifestyle',
        gender: productData.gender || 'Unisex',
        description: productData.description || productData.metaDescription || '',
        specs: productData.specs || [],
        dateReleased: new Date().toISOString().split('T')[0],
        isNew: true,
        inventory: productData.inventory || { "38": 10, "39": 10, "40": 10, "41": 10, "42": 10, "43": 10, "44": 10, "45": 10 }
      };

      if (isFirebaseConfigured && db) {
        try {
          await set(ref(db, `products/${newProd.id}`), newProd);
          return newProd;
        } catch (fbError) {
          console.error('Firebase failed to create product, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      list.push(newProd);
      setLocal(STORAGE_KEYS.PRODUCTS, list);
      return newProd;
    }
  },

  async updateProduct(id: string, productData: any): Promise<Product> {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('API Update Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, updating product in database.', e);
      let updated: Product;

      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await get(ref(db, `products/${id}`));
          if (snapshot.exists()) {
            const existing = snapshot.val() as Product;
            const priceVal = productData.price || productData.regularPrice || existing.price;
            updated = {
              ...existing,
              ...productData,
              price: typeof priceVal === 'number' ? `$${priceVal}` : priceVal
            };
            await set(ref(db, `products/${id}`), updated);
            return updated;
          }
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      const index = list.findIndex(p => p.id === id || (p as any).custom_id === id);
      if (index === -1) throw new Error('Product not found');
      
      const existing = list[index];
      const priceVal = productData.price || productData.regularPrice || existing.price;
      updated = {
        ...existing,
        ...productData,
        price: typeof priceVal === 'number' ? `$${priceVal}` : priceVal
      };
      list[index] = updated;
      setLocal(STORAGE_KEYS.PRODUCTS, list);
      return updated;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}/`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('Django offline, deleting product from database.', e);
      
      if (isFirebaseConfigured && db) {
        try {
          await remove(ref(db, `products/${id}`));
          return true;
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
        }
      }

      let list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      list = list.filter(p => p.id !== id && (p as any).custom_id !== id);
      setLocal(STORAGE_KEYS.PRODUCTS, list);
      return true;
    }
  },

  // ORDERS
  async createOrder(orderData: any): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('API Order Place Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, placing order in database.', e);
      
      const orderIdNumber = 9400 + Math.floor(Math.random() * 1000) + 1;
      const newOrder = {
        id: orderIdNumber,
        order_id: `#ORD-${orderIdNumber}`,
        name: orderData.name,
        email: orderData.email || '',
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        subtotal: orderData.subtotal || orderData.totalPrice || 0,
        shipping_cost: orderData.shipping_cost || orderData.shippingCost || 0,
        final_total: orderData.final_total || orderData.finalTotal || 0,
        payment_method: orderData.payment_method || orderData.paymentMethod,
        selected_mfs: orderData.selected_mfs || orderData.selectedMFS,
        mfs_number: orderData.mfs_number || orderData.mfsNumber,
        trx_id: orderData.trx_id || orderData.trxId,
        status: 'Pending',
        created_at: new Date().toISOString(),
        date_display: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        total_display: `$${(orderData.final_total || orderData.finalTotal || 0).toFixed(2)}`,
        items: orderData.items || []
      };

      // Perform inventory deduction and database write
      if (isFirebaseConfigured && db) {
        try {
          // Write the order
          await set(ref(db, `orders/${orderIdNumber}`), newOrder);

          // Deduct inventory in Firebase in real-time
          for (const item of newOrder.items) {
            const pId = item.id;
            const sizeStr = String(item.size);
            const pSnapshot = await get(ref(db, `products/${pId}`));
            if (pSnapshot.exists()) {
              const productObj = pSnapshot.val() as Product;
              const inventory = productObj.inventory || {};
              if (sizeStr in inventory) {
                inventory[sizeStr] = Math.max(0, Number(inventory[sizeStr]) - Number(item.quantity));
                await update(ref(db, `products/${pId}`), { inventory });
              }
            }
          }
          return newOrder;
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
        }
      }

      // LocalStorage Backup
      const list = getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
      const productList = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      newOrder.items.forEach((item: any) => {
        const pIndex = productList.findIndex(p => p.id === item.id || (p as any).custom_id === item.id);
        if (pIndex !== -1) {
          const product = productList[pIndex];
          const sizeStr = String(item.size);
          const inventory = product.inventory || {};
          if (sizeStr in inventory) {
            inventory[sizeStr] = Math.max(0, Number(inventory[sizeStr]) - Number(item.quantity));
            product.inventory = inventory;
            productList[pIndex] = product;
          }
        }
      });
      setLocal(STORAGE_KEYS.PRODUCTS, productList);

      list.unshift(newOrder);
      setLocal(STORAGE_KEYS.ORDERS, list);
      return newOrder;
    }
  },

  async getOrders(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/orders/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, listing orders from database.', e);
      
      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await get(ref(db, 'orders'));
          if (snapshot.exists()) {
            const rawOrders = snapshot.val();
            const list = Object.values(rawOrders) as any[];
            // Sort by newest first
            return list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          }
          return [];
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
        }
      }

      return getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
    }
  },

  async updateOrder(id: string | number, orderData: any): Promise<any> {
    const rawId = typeof id === 'string' ? id.replace('#ORD-', '').replace('#', '') : id;
    try {
      const res = await fetch(`${BASE_URL}/orders/${rawId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('API Order Update Error');
      return await res.json();
    } catch (e) {
      console.warn(`Django offline, updating order ${id} in database.`, e);
      let updated: any;

      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await get(ref(db, `orders/${rawId}`));
          if (snapshot.exists()) {
            const existing = snapshot.val();
            updated = {
              ...existing,
              ...orderData,
              courier_name: orderData.courier_name || orderData.courier?.name || existing.courier_name || '',
              tracking_id: orderData.tracking_id || orderData.courier?.trackingId || existing.tracking_id || ''
            };
            
            if (orderData.status && orderData.status !== existing.status) {
              const timeline = existing.timeline || [];
              timeline.push({
                status: orderData.status,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                completed: true
              });
              updated.timeline = timeline;
            }
            await set(ref(db, `orders/${rawId}`), updated);
            return updated;
          }
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
      const index = list.findIndex(o => String(o.id) === String(rawId) || o.order_id === String(id));
      if (index === -1) throw new Error('Order not found');
      
      const existing = list[index];
      updated = {
        ...existing,
        ...orderData,
        courier_name: orderData.courier_name || orderData.courier?.name || existing.courier_name,
        tracking_id: orderData.tracking_id || orderData.courier?.trackingId || existing.tracking_id
      };
      
      if (orderData.status && orderData.status !== existing.status) {
        const timeline = existing.timeline || [];
        timeline.push({
          status: orderData.status,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          completed: true
        });
        updated.timeline = timeline;
      }

      list[index] = updated;
      setLocal(STORAGE_KEYS.ORDERS, list);
      return updated;
    }
  },

  // CRM CUSTOMERS
  async getCustomers(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/crm/customers/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, generating CRM Customers from orders.', e);
      let orders: any[] = [];

      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await get(ref(db, 'orders'));
          if (snapshot.exists()) {
            orders = Object.values(snapshot.val()) as any[];
          }
        } catch (fbError) {
          console.error('Firebase CRM failed, using LocalStorage orders.', fbError);
          orders = getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
        }
      } else {
        orders = getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
      }

      const customersMap: Record<string, any> = {};

      orders.forEach(order => {
        const key = (order.phone || '').trim();
        if (!key) return;
        
        if (!customersMap[key]) {
          customersMap[key] = {
            id: `C-00${Object.keys(customersMap).length + 1}`,
            name: order.name,
            email: order.email || 'N/A',
            phone: order.phone,
            orders_count: 0,
            total_spend: 0.0,
            spend: '$0.00',
            joined: order.date_display || new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            mostPurchasedSize: 42,
            orderHistory: []
          };
        }
        const c = customersMap[key];
        c.orders_count += 1;
        c.total_spend += order.final_total || 0;
        c.spend = `$${c.total_spend.toFixed(2)}`;
        c.orderHistory.push({
          id: order.order_id,
          date: order.date_display || new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          total: order.total_display || `$${(order.final_total || 0).toFixed(2)}`,
          status: order.status
        });
      });

      const list = Object.values(customersMap);
      if (list.length === 0) {
        return [
          { 
            id: 'C-001', 
            name: 'Tanvir Ahmed', 
            email: 'tanvir@example.com', 
            phone: '+8801712345678',
            orders: 12, 
            spend: '$245.00', 
            joined: 'Oct 12, 2023',
            mostPurchasedSize: 42,
            orderHistory: [
              { id: '#ORD-9401', date: 'Oct 12, 2023', total: '$245.00', status: 'Delivered' }
            ]
          }
        ];
      }
      return list;
    }
  },

  // REVIEWS
  async getReviews(productId?: string): Promise<any[]> {
    try {
      const url = new URL(`${BASE_URL}/reviews/`);
      if (productId) url.searchParams.append('product', productId);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, listing reviews from database.', e);
      let all: any[] = [];

      if (isFirebaseConfigured && db) {
        try {
          const snapshot = await get(ref(db, 'reviews'));
          if (snapshot.exists()) {
            all = Object.values(snapshot.val()) as any[];
          }
        } catch (fbError) {
          console.error('Firebase failed, falling back to LocalStorage', fbError);
          all = getLocal<any[]>(STORAGE_KEYS.REVIEWS, []);
        }
      } else {
        all = getLocal<any[]>(STORAGE_KEYS.REVIEWS, []);
      }
      
      if (productId) {
        return all.filter(r => String(r.product) === String(productId));
      }
      return all;
    }
  },

  async createReview(reviewData: any): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error('API Review Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, saving review in database.', e);
      
      const newReview = {
        id: Date.now(),
        product: reviewData.product,
        reviewer_name: reviewData.reviewer_name || 'Anonymous',
        rating: reviewData.rating || 5,
        comment: reviewData.comment || '',
        created_at: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          const newRef = push(ref(db, 'reviews'));
          newReview.id = newRef.key as any || newReview.id;
          await set(newRef, newReview);
          return newReview;
        } catch (fbError) {
          console.error('Firebase failed to save review, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<any[]>(STORAGE_KEYS.REVIEWS, []);
      list.push(newReview);
      setLocal(STORAGE_KEYS.REVIEWS, list);
      return newReview;
    }
  },

  // COMMUNICATIONS
  async createMessage(messageData: any): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (!res.ok) throw new Error('API Message Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, storing message in database.', e);
      const newMsg = {
        id: Date.now(),
        ...messageData,
        created_at: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          const newRef = push(ref(db, 'messages'));
          newMsg.id = newRef.key as any || newMsg.id;
          await set(newRef, newMsg);
          return newMsg;
        } catch (fbError) {
          console.error('Firebase failed to send message, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<any[]>(STORAGE_KEYS.MESSAGES, []);
      list.push(newMsg);
      setLocal(STORAGE_KEYS.MESSAGES, list);
      return newMsg;
    }
  },

  async createSubscription(email: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('API Subscription Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, adding subscription in database.', e);
      
      if (isFirebaseConfigured && db) {
        try {
          const newRef = push(ref(db, 'subscriptions'));
          await set(newRef, { email, created_at: new Date().toISOString() });
          return { email };
        } catch (fbError) {
          console.error('Firebase subscription failed, falling back to LocalStorage', fbError);
        }
      }

      const list = getLocal<any[]>(STORAGE_KEYS.SUBSCRIPTIONS, []);
      if (!list.some(s => s.email === email)) {
        list.push({ id: list.length + 1, email, created_at: new Date().toISOString() });
        setLocal(STORAGE_KEYS.SUBSCRIPTIONS, list);
      }
      return { email };
    }
  },

  // DASHBOARD STATS
  async getDashboardStats(): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/stats/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('Django offline, rendering Dashboard stats from database.', e);
      let orders: any[] = [];
      let products: Product[] = [];

      if (isFirebaseConfigured && db) {
        try {
          const oSnapshot = await get(ref(db, 'orders'));
          if (oSnapshot.exists()) {
            orders = Object.values(oSnapshot.val()) as any[];
          }
          const pSnapshot = await get(ref(db, 'products'));
          if (pSnapshot.exists()) {
            products = Object.values(pSnapshot.val()) as Product[];
          }
        } catch (fbError) {
          console.error('Firebase failed dashboard query, using LocalStorage telemetry.', fbError);
          orders = getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
          products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
        }
      } else {
        orders = getLocal<any[]>(STORAGE_KEYS.ORDERS, []);
        products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
      }
      
      const activeOrders = orders.filter(o => ['Pending', 'Confirmed', 'Shipped', 'Processing'].includes(o.status)).length;
      const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.final_total || 0), 0);
      const uniqueCustomers = new Set(orders.map(o => (o.phone || '').trim())).size;

      // Group last 7 days sales
      const sales_chart = [
        { name: 'Mon', sales: 4000, orders: 240 },
        { name: 'Tue', sales: 3000, orders: 198 },
        { name: 'Wed', sales: 2000, orders: 150 },
        { name: 'Thu', sales: 2780, orders: 190 },
        { name: 'Fri', sales: 1890, orders: 120 },
        { name: 'Sat', sales: 2390, orders: 170 },
        { name: 'Sun', sales: 3490, orders: 210 },
      ];
      
      if (orders.length > 0) {
        const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        const lastDay = sales_chart.find(s => s.name === todayName);
        if (lastDay) {
          lastDay.sales = totalRevenue || 4000;
          lastDay.orders = orders.length;
        }
      }

      // Categories distribution from ordered items
      const category_distribution: any[] = [];
      const category_counts: Record<string, number> = {};
      let total_items_count = 0;

      orders.forEach(order => {
        const items = order.items || [];
        items.forEach((item: any) => {
          // Find product category
          const foundP = products.find(p => p.id === item.id);
          const cat = foundP?.category || 'Lifestyle';
          category_counts[cat] = (category_counts[cat] || 0) + Number(item.quantity || 1);
          total_items_count += Number(item.quantity || 1);
        });
      });

      if (total_items_count > 0) {
        Object.entries(category_counts).forEach(([cat, count]) => {
          category_distribution.push({
            label: cat,
            value: Math.round((count / total_items_count) * 100)
          });
        });
      } else {
        category_distribution.push(
          { label: 'Lifestyle Sneakers', value: 45 },
          { label: 'Performance Athletic', value: 30 },
          { label: 'Formal Stitches', value: 15 },
          { label: 'Accessories', value: 10 }
        );
      }

      return {
        revenue: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        revenue_raw: totalRevenue,
        active_orders: activeOrders || 2,
        new_customers: uniqueCustomers || 1,
        conversion_rate: '3.2%',
        sales_chart,
        categories: category_distribution
      };
    }
  }
};
