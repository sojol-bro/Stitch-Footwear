import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Product } from '../constants/products';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from './SkeletonCard';

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let active = true;
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
  }, []);
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products.slice(0, 4) 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-display font-black tracking-tighter mb-2">NEW ARRIVALS</h2>
            <p className="text-brand-lilac/60 font-medium">Explore the latest drops from Stitch Lab.</p>
          </div>
          
          {!isLoading && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-brand-lilac text-white shadow-lg' 
                      : 'bg-brand-cream text-brand-lilac hover:bg-brand-teal/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};
