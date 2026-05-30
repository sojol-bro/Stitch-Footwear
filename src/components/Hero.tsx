import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Wind, Zap, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SHOES = [
  {
    id: '1',
    name: "Aero-Stitch V1",
    price: "$149",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-teal"
  },
  {
    id: '2',
    name: "Cloud-Walk Retro",
    price: "$129",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-lavender"
  },
  {
    id: '3',
    name: "Neon-Pulse Low",
    price: "$159",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000",
    color: "bg-brand-lilac"
  }
];

export const Hero = () => {
  const [activeShoe, setActiveShoe] = useState(SHOES[0]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen pt-24 pb-12 px-6 flex flex-col md:flex-row items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full border-[100px] border-brand-lilac rounded-full blur-[100px]" />
      </div>

      {/* Left: Thumbnails */}
      <div className="flex md:flex-col gap-4 z-10 mb-8 md:mb-0 md:mr-12">
        {SHOES.map((shoe) => (
          <button
            key={shoe.id}
            onClick={() => setActiveShoe(shoe)}
            className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
              activeShoe.id === shoe.id ? 'border-brand-lilac scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img 
              src={shoe.image} 
              alt={shoe.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ))}
      </div>

      {/* Center: Main Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeShoe.id}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full aspect-square flex items-center justify-center"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full blur-[120px] opacity-30 ${activeShoe.color}`} />
            
            <img 
              src={activeShoe.image} 
              alt={activeShoe.name} 
              className="w-full h-auto object-contain drop-shadow-2xl z-10"
              referrerPolicy="no-referrer"
            />

            {/* Floating Badges */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-10 right-0 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 z-20"
            >
              <div className="bg-brand-teal p-2 rounded-xl text-white">
                <Wind size={18} />
              </div>
              <div className="pr-2">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Feature</p>
                <p className="text-sm font-bold">Air Flow</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-20 left-0 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 z-20"
            >
              <div className="bg-brand-lavender p-2 rounded-xl text-white">
                <Zap size={18} />
              </div>
              <div className="pr-2">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Tech</p>
                <p className="text-sm font-bold">Lightweight</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 right-10 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-2 z-20"
            >
              <div className="bg-brand-lilac p-2 rounded-xl text-white">
                <ShieldCheck size={18} />
              </div>
              <div className="pr-2">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Build</p>
                <p className="text-sm font-bold">Durability</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Product Info */}
        <div className="text-center mt-8 z-10">
          <motion.h1 
            key={activeShoe.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-2"
          >
            {activeShoe.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-medium opacity-80 mb-6"
          >
            Starting at {activeShoe.price}
          </motion.p>
          
          <div className="flex items-center justify-center gap-4">
            <Link 
              to={`/product/${activeShoe.id}`}
              className="bg-brand-lilac text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-lilac/90 transition-all hover:scale-105 shadow-xl shadow-brand-lilac/20"
            >
              View Details
            </Link>
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center gap-2 bg-white text-brand-lilac px-6 py-4 rounded-2xl font-bold hover:bg-brand-teal/10 transition-all border border-brand-lilac/10"
            >
              <Play size={20} fill="currentColor" />
              Experience 360°
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-cream/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* Turntable Video Placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-brand-teal/20">
                <div className="text-center">
                  <Play size={64} className="mx-auto mb-4 text-brand-lilac opacity-50" />
                  <p className="text-brand-lilac font-display font-bold text-2xl">360° Turntable Experience</p>
                  <p className="text-brand-lilac/60">Loading high-fidelity render...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
