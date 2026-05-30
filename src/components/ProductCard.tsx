import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../constants/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden mb-4 bg-brand-cream/50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <img 
          src={product.hoverImage} 
          alt={`${product.name} alternate`}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 opacity-0 group-hover:scale-110 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2.5 rounded-xl shadow-lg transition-all duration-300 backdrop-blur-md ${
              isInWishlist(product.id)
                ? 'bg-brand-lilac text-white scale-110'
                : 'bg-white/80 text-brand-lilac hover:bg-white hover:scale-110'
            }`}
          >
            <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>

      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-brand-lilac">{product.name}</h3>
          <p className="font-bold text-brand-lilac">{product.price}</p>
        </div>
        <p className="text-[10px] font-bold text-brand-lilac/40 uppercase tracking-widest mb-4">{product.category}</p>
        
        <button 
          onClick={() => addToCart({ ...product, quantity: 1 })}
          className="w-full bg-brand-lilac text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-lavender transition-all group/btn"
        >
          <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" />
          QUICK ADD
        </button>
      </div>
    </motion.div>
  );
};
