import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ArrowRight, Clock, X, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../constants/products';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const NewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest'>('Newest');
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 32, secs: 45 });

  // Notify Modal State
  const [notifyingProduct, setNotifyingProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // Record interest dynamically
    api.createSubscription(email).catch(console.error);
    setEmailError('');
    setShowSuccess(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const newProducts = useMemo(() => {
    const result = products.filter(p => p.isNew && !p.isComingSoon);
    return result.sort((a, b) => {
      const dateA = new Date(a.dateReleased || a.date_released || '').getTime();
      const dateB = new Date(b.dateReleased || b.date_released || '').getTime();
      return sortBy === 'Newest' ? dateB - dateA : dateA - dateB;
    });
  }, [products, sortBy]);

  const comingSoon = useMemo(() => {
    return products.filter(p => p.isComingSoon);
  }, [products]);

  return (
    <div className="pt-24 min-h-screen bg-brand-cream">
      <Breadcrumbs />

      {/* Hero Section with Lavender Gradient */}
      <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-br from-brand-lavender/40 via-brand-cream to-brand-cream">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-brand-lilac text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                Fresh Drop
              </span>
              <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter text-brand-lilac leading-none mb-8">
                THE<br />NEW DROP
              </h1>
              
              {/* Countdown Timer */}
              <div className="flex gap-4 mb-12">
                {[
                  { label: 'DAYS', value: timeLeft.days },
                  { label: 'HRS', value: timeLeft.hours },
                  { label: 'MINS', value: timeLeft.mins },
                  { label: 'SECS', value: timeLeft.secs }
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-2">
                      <span className="text-2xl font-black text-brand-lilac">{String(item.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[8px] font-black text-brand-lilac/40 tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-brand-lavender/20 blur-[100px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000" 
                alt="New Arrival" 
                className="relative z-10 w-full h-auto rounded-[4rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coming Soon Carousel */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-black tracking-tighter text-brand-lilac uppercase">Coming Soon</h2>
              <p className="text-brand-lilac/60 font-medium">Don't miss the next evolution.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 border border-brand-lilac/10 rounded-full hover:bg-brand-lilac/5 transition-colors">
                <ArrowRight className="rotate-180" size={20} />
              </button>
              <button className="p-3 border border-brand-lilac/10 rounded-full hover:bg-brand-lilac/5 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {comingSoon.map(product => (
              <motion.div 
                key={product.id}
                className="flex-shrink-0 w-[300px] md:w-[400px] snap-start group"
              >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-brand-cream border border-brand-lilac/5 mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-lilac/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => {
                      setNotifyingProduct(product);
                      setEmail('');
                      setEmailError('');
                      setShowSuccess(false);
                    }}
                    className="absolute bottom-6 left-6 right-6 bg-brand-lilac text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                  >
                    <Bell size={18} />
                    NOTIFY ME
                  </button>
                </div>
                <h3 className="text-xl font-display font-black text-brand-lilac uppercase">{product.name}</h3>
                <p className="text-sm font-bold text-brand-lilac/40 tracking-widest uppercase">{product.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Drops Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <h2 className="text-4xl font-display font-black tracking-tighter text-brand-lilac uppercase">Latest Drops</h2>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-brand-lilac/40 uppercase tracking-widest">Sort By:</span>
              <div className="flex bg-brand-cream p-1 rounded-xl">
                {(['Newest', 'Oldest'] as const).map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      sortBy === option ? 'bg-white text-brand-lilac shadow-sm' : 'text-brand-lilac/40 hover:text-brand-lilac'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Notify Modal */}
      <AnimatePresence>
        {notifyingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/45 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-brand-lilac/10 p-8 relative"
            >
              <button
                onClick={() => setNotifyingProduct(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-brand-lilac/45 hover:bg-brand-lilac/5 hover:text-brand-lilac transition-all"
              >
                <X size={20} />
              </button>

              {!showSuccess ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-brand-lilac/10 rounded-2xl flex items-center justify-center text-brand-lilac mx-auto">
                    <Bell size={28} />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-display font-black text-brand-lilac uppercase tracking-tight">Stay in the Loop</h3>
                    <p className="text-sm text-brand-lilac/60 font-medium leading-relaxed">
                      Get an exclusive alert the moment <strong className="font-extrabold text-[#7A6BB2]">{notifyingProduct.name}</strong> launches.
                    </p>
                  </div>

                  <form onSubmit={handleNotifySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-lilac/40 uppercase tracking-widest block ml-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="john@example.com"
                        className={`w-full bg-brand-cream/40 border-2 px-6 py-4 rounded-2xl outline-none transition-all font-bold text-brand-lilac ${
                          emailError ? 'border-red-550 focus:border-red-550' : 'border-transparent focus:border-brand-lilac'
                        }`}
                      />
                      {emailError && (
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-2">{emailError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-lilac text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#7A6BB2] transition-all shadow-lg shadow-brand-lilac/20"
                    >
                      <Bell size={16} />
                      Notify Me At Drop
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-black text-brand-lilac uppercase tracking-tight border-b-0">You're Set!</h3>
                    <p className="text-sm text-brand-lilac/70 font-medium px-4 leading-relaxed">
                      Perfect! We've saved your slot. We will notify you instantly at <strong className="font-black text-brand-lilac/90">{email}</strong> when <strong className="font-extrabold text-[#7A6BB2]">{notifyingProduct.name}</strong> drops.
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifyingProduct(null)}
                    className="w-full bg-[#EAE3D5] text-brand-lilac font-black text-xs py-4 rounded-2xl hover:bg-[#DED7C9] transition-all"
                  >
                    CLOSE
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
