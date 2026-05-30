import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-display font-black tracking-tighter mb-2 text-brand-lilac uppercase">Your Wishlist</h1>
            <p className="text-brand-lilac/60 font-medium">Items you've saved for later.</p>
          </div>
          <Link 
            to="/" 
            className="text-sm font-bold underline underline-offset-8 hover:text-brand-lavender transition-colors text-brand-lilac"
          >
            CONTINUE SHOPPING
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-20 text-center space-y-6 shadow-sm"
          >
            <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto">
              <Heart size={48} className="text-brand-lilac/20" />
            </div>
            <h2 className="text-2xl font-bold text-brand-lilac">Your wishlist is empty</h2>
            <p className="text-brand-lilac/60 max-w-md mx-auto">
              Save items you love to your wishlist and they'll appear here.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-brand-lilac text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-lavender transition-all shadow-lg shadow-brand-lilac/20"
            >
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className={`relative aspect-square rounded-2xl overflow-hidden mb-4 ${product.color}`}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm text-brand-lilac"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="px-2 pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-brand-lilac">{product.name}</h3>
                      <p className="font-bold text-brand-lilac">{product.price}</p>
                    </div>
                    <p className="text-xs font-bold text-brand-lilac/40 uppercase tracking-widest mb-4">{product.category}</p>
                    
                    <div className="flex gap-2">
                      <Link 
                        to={`/product/${product.id}`}
                        className="flex-1 bg-brand-cream text-brand-lilac py-3 rounded-xl font-bold text-xs text-center hover:bg-brand-teal/20 transition-colors"
                      >
                        VIEW
                      </Link>
                      <button 
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: 1
                        })}
                        className="flex-1 bg-brand-lilac text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-lavender transition-all"
                      >
                        <ShoppingBag size={14} />
                        ADD
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suggested Section */}
        {wishlist.length > 0 && (
          <div className="mt-24 pt-24 border-t border-brand-lilac/10">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-display font-black tracking-tight text-brand-lilac uppercase">Recommended for you</h2>
              <ArrowRight className="text-brand-lilac/20" />
            </div>
            {/* We could add a mini grid here or just leave it as a placeholder for now */}
          </div>
        )}
      </div>
    </div>
  );
};
