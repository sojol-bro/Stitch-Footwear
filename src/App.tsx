/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { NewArrivals } from './pages/NewArrivals';
import { CollectionPage } from './components/CollectionPage';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard as AdminDashboard } from './admin/pages/Dashboard';
import { DesignSystem as AdminDesignSystem } from './admin/pages/DesignSystem';
import { Inventory as AdminInventory } from './admin/pages/Inventory';
import { Orders as AdminOrders } from './admin/pages/Orders';
import { Customers as AdminCustomers } from './admin/pages/Customers';
import { Reviews as AdminReviews } from './admin/pages/Reviews';
import { Communications as AdminCommunications } from './admin/pages/Communications';
import { Settings as AdminSettings } from './admin/pages/Settings';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { FilterProvider } from './context/FilterContext';
import { CartDrawer } from './components/CartDrawer';

const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen selection:bg-brand-lavender selection:text-white">
      {!isAdminPath && <Navbar />}
      {!isAdminPath && <CartDrawer />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route 
            path="/men" 
            element={
              <CollectionPage 
                gender="Men" 
                title="Men's Collection" 
                heroImage="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=1000"
                filters={['Lifestyle', 'Athletic', 'Formal']}
              />
            } 
          />
          <Route 
            path="/women" 
            element={
              <CollectionPage 
                gender="Women" 
                title="Women's Collection" 
                heroImage="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"
                filters={['Heels', 'Sneakers', 'Sandals', 'Flats']}
              />
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="design" element={<AdminDesignSystem />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="communications" element={<AdminCommunications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <FilterProvider>
            <LayoutWrapper />
          </FilterProvider>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}
