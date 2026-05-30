import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { api } from '../services/api';
import { Product } from '../constants/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.getProducts()
      .then(data => {
        if (active) setProducts(data);
      })
      .catch(console.error);
    return () => { active = false; };
  }, [isOpen]);

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ['name', 'category', 'description'],
      threshold: 0.4,
    });
  }, [products]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const saved = localStorage.getItem('stitch_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = fuse.search(query).map(r => r.item);
      setResults(searchResults.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      // In a real app, we might navigate to a full search results page
      onClose();
    }
  };

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('stitch_recent_searches', JSON.stringify(updated));
  };

  const handleResultClick = (product: Product) => {
    saveSearch(product.name);
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-brand-cream/95 backdrop-blur-xl flex flex-col"
        >
          <div className="p-6 flex justify-end">
            <button 
              onClick={onClose}
              className="p-3 hover:bg-brand-lilac/10 rounded-full transition-colors text-brand-lilac"
            >
              <X size={32} />
            </button>
          </div>

          <div className="flex-1 max-w-5xl mx-auto w-full px-6 pt-12">
            <form onSubmit={handleSearch} className="relative mb-16">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for your next stitch..."
                className="w-full bg-transparent border-b-2 border-brand-lilac py-6 text-4xl md:text-6xl font-display font-black tracking-tighter text-brand-lilac placeholder:text-brand-lilac/20 focus:outline-none"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-lilac" size={48} />
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Top Suggestions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-lilac/40 mb-6">Top Suggestions</h3>
                <div className="space-y-4">
                  {results.length > 0 ? (
                    results.slice(0, 4).map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="flex items-center gap-3 text-lg font-bold text-brand-lilac hover:text-brand-lavender transition-colors group text-left w-full"
                      >
                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        {product.name}
                      </button>
                    ))
                  ) : (
                    ['New Arrivals', 'Men Collection', 'Women Collection', 'Best Sellers'].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="flex items-center gap-3 text-lg font-bold text-brand-lilac hover:text-brand-lavender transition-colors group text-left w-full"
                      >
                        <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        {suggestion}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Matching Products */}
              <div className="md:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-lilac/40 mb-6">Matching Products</h3>
                <div className="space-y-6">
                  {results.length > 0 ? (
                    results.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="flex items-center gap-4 group w-full text-left"
                      >
                        <div className={`w-16 h-16 rounded-xl overflow-hidden ${product.color}/20 flex-shrink-0`}>
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-lilac group-hover:text-brand-lavender transition-colors">{product.name}</p>
                          <p className="text-sm font-bold opacity-50">{product.price}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-brand-lilac/40 italic">Start typing to see products...</p>
                  )}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-lilac/40 mb-6">Recent Searches</h3>
                <div className="space-y-4">
                  {recentSearches.length > 0 ? (
                    recentSearches.map(search => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="flex items-center gap-3 text-lg font-bold text-brand-lilac hover:text-brand-lavender transition-colors group text-left w-full"
                      >
                        <Clock size={16} className="text-brand-lilac/40" />
                        {search}
                      </button>
                    ))
                  ) : (
                    <p className="text-brand-lilac/40 italic">No recent searches</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
