import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-cream z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-brand-lilac/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-brand-lilac" size={24} />
                <h2 className="text-xl font-display font-black tracking-tight text-brand-lilac uppercase">Your Bag</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-brand-lilac/10 rounded-full transition-colors"
              >
                <X size={24} className="text-brand-lilac" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-brand-lilac/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-brand-lilac/20" />
                  </div>
                  <p className="text-brand-lilac/60 font-medium">Your bag is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-brand-lilac font-bold underline underline-offset-4"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-brand-lilac/5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-brand-lilac leading-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-brand-lilac/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {item.size && (
                          <p className="text-xs font-bold text-brand-lilac/40 uppercase tracking-widest mt-1">Size: {item.size}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-xl border border-brand-lilac/5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="text-brand-lilac/60 hover:text-brand-lilac"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-brand-lilac w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            className="text-brand-lilac/60 hover:text-brand-lilac"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-bold text-brand-lilac">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-brand-lilac/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-brand-lilac/60 font-medium">Subtotal</span>
                  <span className="text-xl font-display font-black text-brand-lilac">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-brand-lilac/40 text-center">Shipping and taxes calculated at checkout.</p>
                <Link 
                  to="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-brand-lilac text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-lavender transition-all shadow-lg shadow-brand-lilac/20 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
