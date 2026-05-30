import { ShoppingBag, Search, Menu, Heart, X, User, Shield, LogOut, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import { SearchOverlay } from './SearchOverlay';
import { AuthModal } from './AuthModal';
import { NAV_LINKS } from '../constants/navigation';

export const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('stitch_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-brand-cream/80 backdrop-blur-md border-b border-brand-lilac/10">
        <div className="flex items-center gap-8">
          <Link to="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-display font-bold tracking-tighter text-brand-lilac"
            >
              STITCH
            </motion.div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="text-sm font-medium hover:text-brand-lavender transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-brand-teal/20 rounded-full transition-colors text-brand-lilac cursor-pointer"
          >
            <Search size={20} />
          </button>
          <Link 
            to="/wishlist"
            className="p-2 hover:bg-brand-teal/20 rounded-full transition-colors relative text-brand-lilac cursor-pointer"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 bg-brand-lavender text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {wishlist.length}
              </motion.span>
            )}
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-brand-teal/20 rounded-full transition-colors relative text-brand-lilac cursor-pointer"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 bg-brand-lavender text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* User Profile / Admin portal trigger */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-lilac/10 hover:border-brand-lilac/30 hover:bg-brand-teal/10 transition-all text-brand-lilac text-xs font-bold cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-lilac text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {currentUser.name[0]}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>

                {/* User actions dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-48 bg-white border border-brand-lilac/10 rounded-2xl shadow-xl p-1.5 z-50 overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-brand-lilac/5">
                          <p className="text-[8px] font-black text-brand-lilac/40 uppercase tracking-widest leading-none">Signed in</p>
                          <p className="text-xs font-bold text-brand-lilac mt-1 truncate">{currentUser.name}</p>
                        </div>
                        
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-brand-lilac hover:bg-brand-lilac/5 transition-all cursor-pointer"
                        >
                          <Shield size={14} className="text-brand-lilac" />
                          <span>Go to Admin Panel</span>
                        </Link>
                        
                        <Link
                          to="/wishlist"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-brand-lilac hover:bg-brand-lilac/5 transition-all cursor-pointer"
                        >
                          <Heart size={14} className="text-brand-lilac" />
                          <span>My Wishlist</span>
                        </Link>

                        <button
                          onClick={() => {
                            localStorage.removeItem('stitch_user');
                            setCurrentUser(null);
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-brand-lilac hover:bg-brand-lilac/90 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-brand-lilac/10 cursor-pointer"
                >
                  <User size={12} />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="md:hidden p-2 hover:bg-brand-teal/20 rounded-full transition-colors text-brand-lilac cursor-pointer"
                >
                  <User size={20} />
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-brand-teal/20 rounded-full transition-colors text-brand-lilac cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-cream flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-display font-bold tracking-tighter text-brand-lilac">STITCH</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-brand-lilac/10 rounded-full transition-colors text-brand-lilac"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-display font-black tracking-tighter text-brand-lilac hover:text-brand-lavender transition-colors uppercase"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Auth and Admin section */}
            <div className="mt-6 pt-6 border-t border-brand-lilac/10 flex flex-col gap-4">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-brand-lilac/5 p-4 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-brand-lilac text-white flex items-center justify-center font-black">
                      {currentUser.name[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-brand-lilac/40 uppercase tracking-widest leading-none">Logged In</p>
                      <p className="text-sm font-bold text-brand-lilac mt-1">{currentUser.name}</p>
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 bg-brand-lilac text-white font-bold rounded-2xl hover:bg-brand-lilac/90 transition-all shadow-md"
                  >
                    <span className="flex items-center gap-2 text-xs uppercase tracking-wider">
                      <Shield size={16} /> Admin Panel
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('stitch_user');
                      setCurrentUser(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold text-xs tracking-wider uppercase transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-brand-lilac text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <User size={14} />
                    <span>Sign In / Sign Up</span>
                  </button>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 rounded-2xl bg-brand-lilac/5 text-brand-lilac border border-brand-lilac/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Shield size={14} />
                    <span>Go to Admin Panel</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-brand-lilac/10">
              <p className="text-xs font-bold text-brand-lilac/40 uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex gap-6 text-brand-lilac font-bold">
                <a href="#" className="hover:text-brand-lavender transition-colors">Instagram</a>
                <a href="#" className="hover:text-brand-lavender transition-colors">Twitter</a>
                <a href="#" className="hover:text-brand-lavender transition-colors">TikTok</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </>
  );
};
