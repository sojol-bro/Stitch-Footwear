import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleDemoLogin = (role: 'user' | 'admin') => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        onClose();
        navigate('/admin');
      } else {
        const demoUser = { name: 'Nesha Isnan', email: 'neshaisnan12@gmail.com' };
        localStorage.setItem('stitch_user', JSON.stringify(demoUser));
        onSuccess(demoUser);
        setSuccess('Successfully signed in as demo user!');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 1500);
      }
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field validation
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: isSignUp ? name : (email.split('@')[0] || 'User'),
        email: email,
      };

      // Save user session
      localStorage.setItem('stitch_user', JSON.stringify(userData));
      onSuccess(userData);
      setSuccess(isSignUp ? 'Account created successfully!' : 'Successfully signed in!');
      
      setTimeout(() => {
        setSuccess('');
        onClose();
        // Reset states
        setEmail('');
        setPassword('');
        setName('');
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-brand-lilac/10 bg-brand-cream p-8 shadow-2xl md:p-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-brand-lilac/50 hover:bg-brand-lilac/5 hover:text-brand-lilac transition-all"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <span className="text-sm font-black uppercase tracking-widest text-brand-lilac/40">
                {isSignUp ? 'Join Stitch' : 'Welcome Back'}
              </span>
              <h2 className="mt-1 text-3xl font-display font-black uppercase text-brand-lilac tracking-tight">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
            </div>

            {/* Success Animation */}
            {success ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center text-brand-lilac"
              >
                <CheckCircle size={56} className="text-brand-lilac mb-4 animate-bounce" />
                <p className="text-lg font-bold">{success}</p>
                <p className="text-sm text-brand-lilac/60 mt-1">Directing you to the catalog...</p>
              </motion.div>
            ) : (
              <>
                {/* Regular Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-lilac/60 ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-lilac/40" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white/60 border-2 border-transparent focus:border-brand-lilac/30 rounded-2xl pl-12 pr-4 py-3.5 outline-none font-medium text-brand-lilac transition-all text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-lilac/60 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-lilac/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/60 border-2 border-transparent focus:border-brand-lilac/30 rounded-2xl pl-12 pr-4 py-3.5 outline-none font-medium text-brand-lilac transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-lilac/60 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-lilac/40" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/60 border-2 border-transparent focus:border-brand-lilac/30 rounded-2xl pl-12 pr-4 py-3.5 outline-none font-medium text-brand-lilac transition-all text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="text-xs font-bold text-red-500 ml-1"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 mt-2 rounded-2xl bg-brand-lilac text-white font-bold text-sm hover:bg-brand-lilac/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-lilac/15"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch view */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                    className="text-xs font-bold text-brand-lilac/60 hover:text-brand-lilac underline transition-colors"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-brand-lilac/10" />
                  </div>
                  <span className="relative bg-brand-cream px-4 text-[10px] font-black uppercase tracking-widest text-brand-lilac/30">
                    Quick Sandbox Access
                  </span>
                </div>

                {/* Quick Access links: Demo user & direct Admin Portal shortcut */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('user')}
                    disabled={isLoading}
                    className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-brand-lilac/10 bg-white/40 hover:bg-brand-lilac/5 hover:border-brand-lilac/30 transition-all text-left"
                  >
                    <span className="text-[9px] font-black text-brand-lilac/40 uppercase tracking-widest">Demo User</span>
                    <span className="text-xs font-bold text-brand-lilac">Nesha Isnan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                    className="flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border border-brand-lilac/10 bg-brand-lilac/5 hover:bg-brand-lilac/10 hover:border-brand-lilac/40 transition-all text-center"
                  >
                    <span className="text-[9px] font-black text-brand-lilac/40 uppercase tracking-widest flex items-center gap-1">
                      <Shield size={8} /> Admin Panel
                    </span>
                    <span className="text-xs font-bold text-brand-lilac">Go to Admin</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
