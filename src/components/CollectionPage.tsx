import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, LayoutGrid, List, X } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../constants/products';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterSidebar } from './FilterSidebar';
import { useFilters } from '../context/FilterContext';
import { SkeletonCard } from './SkeletonCard';

interface CollectionPageProps {
  gender: 'Men' | 'Women';
  title: string;
  heroImage: string;
  filters: string[];
}

export const CollectionPage: React.FC<CollectionPageProps> = ({ gender, title, heroImage, filters: categoryFilters }) => {
  const { filters, setCategory, setSortOrder } = useFilters();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    api.getProducts()
      .then(data => {
        if (active) {
          setProducts(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [filters]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.gender === gender || p.gender === 'Unisex');
    
    // Category Filter
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    // Size Filter
    if (filters.size) {
      // In a real app, products would have an array of available sizes
      // For this demo, we'll simulate it
      result = result.filter((_, index) => (index + (filters.size || 0)) % 3 !== 0);
    }

    // Color Filter
    if (filters.color) {
      // Simulating color filter based on the product's color class or name
      result = result.filter(p => p.color.includes(filters.color!.toLowerCase()) || p.name.includes(filters.color!));
    }

    // Price Filter
    result = result.filter(p => {
      const price = parseInt(p.price.replace('$', ''));
      return price <= filters.priceRange[1];
    });

    // Sorting
    result = [...result].sort((a, b) => {
      const priceA = parseInt(a.price.replace('$', ''));
      const priceB = parseInt(b.price.replace('$', ''));
      
      if (filters.sortOrder === 'Price: Low to High') return priceA - priceB;
      if (filters.sortOrder === 'Price: High to Low') return priceB - priceA;
      if (filters.sortOrder === 'Newest') return new Date(b.dateReleased).getTime() - new Date(a.dateReleased).getTime();
      return 0;
    });

    return result;
  }, [gender, filters]);

  return (
    <div className="pt-24 min-h-screen bg-brand-cream">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter text-brand-lilac leading-none mb-6">
              STITCH /<br />{gender.toUpperCase()}
            </h1>
            <p className="text-xl text-brand-lilac/60 max-w-md font-medium leading-relaxed">
              Discover our latest {gender.toLowerCase()}'s collection. Engineered for comfort, designed for the bold.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img 
              src={heroImage} 
              alt={`${gender} Collection`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-lilac/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white py-24 px-6 mt-12 rounded-t-[4rem] shadow-[0_-20px_50px_-20px_rgba(155,142,199,0.1)]">
        <div className="max-w-7xl mx-auto flex gap-12">
          
          {/* Sticky Sidebar (Desktop) */}
          <FilterSidebar />

          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <div className="flex flex-wrap gap-3">
                  {['All', ...categoryFilters].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        filters.category === cat 
                          ? 'bg-brand-lilac text-white shadow-lg shadow-brand-lilac/20' 
                          : 'bg-brand-cream text-brand-lilac hover:bg-brand-lilac/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                {/* Mobile Filter Trigger */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden p-3 bg-brand-cream text-brand-lilac rounded-2xl hover:bg-brand-lilac/5 transition-all"
                >
                  <Filter size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <div className="flex bg-brand-cream p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-brand-lilac shadow-sm' : 'text-brand-lilac/40'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-brand-lilac shadow-sm' : 'text-brand-lilac/40'}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                <div className="relative group">
                  <select 
                    value={filters.sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none bg-brand-cream text-brand-lilac px-6 py-3 pr-10 rounded-2xl font-bold text-sm focus:outline-none cursor-pointer hover:bg-brand-lilac/5 transition-colors"
                  >
                    <option>Featured</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-lilac pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 space-y-6"
              >
                <div className="w-32 h-32 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-8">
                  <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="Empty" className="w-16 h-16 opacity-20 grayscale" />
                </div>
                <h2 className="text-3xl font-display font-black text-brand-lilac uppercase">No Stitches Found</h2>
                <p className="text-brand-lilac/60 max-w-md mx-auto font-medium">
                  We couldn't find any products matching your current filters. Try exploring our new arrivals instead!
                </p>
                <button 
                  onClick={() => setCategory('All')}
                  className="bg-brand-lilac text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-lavender transition-all shadow-xl shadow-brand-lilac/20"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <MobileFilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)} 
      />
    </div>
  );
};

// Mobile Filter Drawer
const MobileFilterDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-lilac/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-[70] shadow-2xl p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-display font-black text-brand-lilac uppercase">Filters</h3>
              <button onClick={onClose} className="p-2 hover:bg-brand-cream rounded-xl transition-colors">
                <X size={24} className="text-brand-lilac" />
              </button>
            </div>
            <div className="mobile-filter-content">
              <FilterSidebar isMobile />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
