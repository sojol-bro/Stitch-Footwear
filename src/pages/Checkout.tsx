import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Smartphone,
  Lock,
  Award,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CITIES = [
  { name: 'Dhaka', shipping: 5 },
  { name: 'Chittagong', shipping: 10 },
  { name: 'Sylhet', shipping: 10 },
  { name: 'Rajshahi', shipping: 10 },
  { name: 'Khulna', shipping: 10 },
  { name: 'Barisal', shipping: 10 },
  { name: 'Rangpur', shipping: 10 },
  { name: 'Mymensingh', shipping: 10 },
  { name: 'Gazipur', shipping: 5 },
  { name: 'Narayanganj', shipping: 5 },
];

const UPSELL_PRODUCTS = [
  {
    id: 'upsell-1',
    name: 'Stitch Performance Socks',
    price: '$12',
    image: 'https://images.unsplash.com/photo-1582966772640-8b091443c3cd?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'upsell-2',
    name: 'Premium Shoe Care Kit',
    price: '$25',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=200',
  }
];

export const Checkout = () => {
  const { cart, totalPrice, clearCart, addToCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    mfsNumber: '',
    trxId: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [selectedMFS, setSelectedMFS] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const shippingCost = useMemo(() => {
    const city = CITIES.find(c => c.name === formData.city);
    return city ? city.shipping : 120;
  }, [formData.city]);

  const finalTotal = totalPrice + shippingCost;

  const detailConfig = useMemo(() => {
    if (!selectedMFS) return null;
    return selectedMFS === 'bKash'
      ? { bg: 'bg-[#e2136e]/15', border: 'border-[#e2136e]/30', text: 'text-[#e2136e]', textHighlight: 'text-[#e2136e] font-black', labelText: 'text-[#e2136e]/70', inputFocus: 'focus:border-[#e2136e]' }
      : selectedMFS === 'Nagad'
      ? { bg: 'bg-[#f7901e]/15', border: 'border-[#f7901e]/30', text: 'text-[#f7901e]', textHighlight: 'text-[#f7901e] font-black', labelText: 'text-[#f7901e]/70', inputFocus: 'focus:border-[#f7901e]' }
      : { bg: 'bg-[#8c3494]/15', border: 'border-[#8c3494]/30', text: 'text-[#8c3494]', textHighlight: 'text-[#8c3494] font-black', labelText: 'text-[#8c3494]/70', inputFocus: 'focus:border-[#8c3494]' };
  }, [selectedMFS]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = useMemo(() => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const basicInfo = formData.name.trim().length > 0 &&
                     phoneDigits.length === 11 &&
                     formData.address.trim().length > 0;
    
    if (paymentMethod === 'cod') return basicInfo;
    
    if (paymentMethod === 'online') {
      if (!selectedMFS) return false;
      return basicInfo && 
             formData.mfsNumber.replace(/\D/g, '').length === 11 && 
             formData.trxId.trim().length >= 6;
    }
    
    return false;
  }, [formData, paymentMethod, selectedMFS]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      subtotal: totalPrice,
      shipping_cost: shippingCost,
      final_total: finalTotal,
      payment_method: paymentMethod,
      selected_mfs: selectedMFS,
      mfs_number: formData.mfsNumber,
      trx_id: formData.trxId,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        quantity: item.quantity
      }))
    };
    
    if (paymentMethod === 'online' && formData.trxId) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsProcessing(true);
        api.createOrder(orderData)
          .then(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
          })
          .catch(err => {
            console.error(err);
            setIsProcessing(false);
            alert('Error placing order. Please try again.');
          });
      }, 1500);
    } else {
      setIsProcessing(true);
      api.createOrder(orderData)
        .then(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          clearCart();
        })
        .catch(err => {
          console.error(err);
          setIsProcessing(false);
          alert('Error placing order. Please try again.');
        });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-[#F2EAE0]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-[#8845e4] uppercase">Order Placed!</h1>
          <p className="text-[#8845e4]/60 font-medium">
            Thank you for choosing Stitch. Your order is being processed and will be at your doorstep soon.
          </p>
          <Link 
            to="/" 
            className="inline-block w-full bg-[#8845e4] text-white py-4 rounded-2xl font-bold hover:bg-[#BDA6CE] transition-all shadow-lg shadow-[#8845e4]/20"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#F2EAE0]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center lg:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-[#8845e4]/85 hover:text-[#8845e4] font-bold transition-colors mb-4">
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-[#8845e4] uppercase">Checkout</h1>
          <p className="text-[#8845e4]/85 font-medium mt-2">Step into your new pair. Choose your payment method below.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Column 1: Order Summary & Upsell */}
          <div className="space-y-8 order-1 lg:order-1">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Order Summary</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#F2EAE0] rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#8845e4] text-sm leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-[#8845e4]/70 font-bold uppercase tracking-widest mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="font-bold text-[#8845e4] text-sm mt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-[#8845e4]/70 text-center py-4">Your bag is empty.</p>}
              </div>

              {/* Upsell Section */}
              <div className="pt-6 border-t border-[#F2EAE0] space-y-4">
                <h3 className="text-xs font-black text-[#8845e4]/70 uppercase tracking-widest">Recommended for your shoes</h3>
                <div className="space-y-3">
                  {UPSELL_PRODUCTS.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-[#B4D3D9] rounded-2xl border border-transparent hover:border-[#8845e4]/25 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-[10px] font-bold text-[#8845e4]">{product.name}</p>
                          <p className="text-[10px] font-black text-[#8845e4]/80">{product.price}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        disabled={addingItemId !== null}
                        onClick={() => {
                          setAddingItemId(product.id);
                          setTimeout(() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              size: 'One Size'
                            });
                            setAddingItemId(null);
                          }, 800);
                        }}
                        className={`checkout-recommended-add-button text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full transition-all duration-300 border ${
                          addingItemId === product.id
                            ? "bg-[#8845e4]/20 text-[#8845e4]/50 border-transparent cursor-not-allowed animate-pulse scale-95"
                            : addingItemId !== null
                            ? "opacity-40 border-transparent text-[#8845e4]/40 cursor-not-allowed"
                            : "text-[#8845e4] hover:text-white hover:bg-[#8845e4] border-[#8845e4]/20 hover:border-[#8845e4] hover:scale-105 active:scale-95 cursor-pointer"
                        }`}
                      >
                        {addingItemId === product.id ? "Adding..." : "Add +"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#F2EAE0] space-y-3">
                <div className="flex justify-between text-[#8845e4]/80 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8845e4]/80 text-sm font-medium">
                  <span>Shipping ({formData.city})</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-display font-black text-[#8845e4] pt-3 border-t border-[#F2EAE0]">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: Shipping Information */}
          <div className="space-y-8 order-2 lg:order-2">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Shipping Info</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#8845e4]/70 uppercase tracking-widest ml-2">Full Name</label>
                  <input 
                    required 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Tanvir Ahmed" 
                    className="w-full bg-[#F2EAE0]/50 border-2 border-transparent focus:border-[#8845e4] px-6 py-4 rounded-2xl outline-none transition-all font-medium text-[#8845e4]" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#8845e4]/70 uppercase tracking-widest ml-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8845e4]/70 font-bold">+88</span>
                    <input 
                      required 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXX-XXXXXX" 
                      className="w-full bg-[#F2EAE0]/50 border-2 border-transparent focus:border-[#8845e4] pl-16 pr-6 py-4 rounded-2xl outline-none transition-all font-medium text-[#8845e4]" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#8845e4]/70 uppercase tracking-widest ml-2">City</label>
                  <div className="relative">
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#F2EAE0]/50 border-2 border-transparent focus:border-[#8845e4] px-6 py-4 rounded-2xl outline-none transition-all font-medium text-[#8845e4] appearance-none cursor-pointer"
                    >
                      {CITIES.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#8845e4]/70 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#8845e4]/70 uppercase tracking-widest ml-2">Full Address</label>
                  <input 
                    required 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House, Road, Area..." 
                    className="w-full bg-[#F2EAE0]/50 border-2 border-transparent focus:border-[#8845e4] px-6 py-4 rounded-2xl outline-none transition-all font-medium text-[#8845e4]" 
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Column 3: Payment Method Selection */}
          <div className="space-y-8 order-3 lg:order-3">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Pay Online Option */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setPaymentMethod('online')}
                  onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('online')}
                  className={`w-full text-left p-6 rounded-3xl border-2 transition-all space-y-3 cursor-pointer ${
                    paymentMethod === 'online' 
                    ? 'border-[#8845e4] bg-[#8845e4]/15' 
                    : 'border-[#F2EAE0] hover:border-[#8845e4]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'online' ? 'bg-[#8845e4] text-white' : 'bg-[#F2EAE0] text-[#8845e4]'}`}>
                        <CreditCard size={20} />
                      </div>
                      <span className="font-bold text-[#8845e4]">Online Payment</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#8845e4]' : 'border-[#F2EAE0]'}`}>
                      {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-[#8845e4]" />}
                    </div>
                  </div>
                  <p className="text-xs text-[#8845e4]/80 font-medium leading-relaxed">
                    Pay securely with Mobile Banking, Debit/Credit Card via SSLCommerz.
                  </p>
                  
                  <AnimatePresence>
                    {paymentMethod === 'online' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 grid grid-cols-3 gap-2">
                          {['bKash', 'Nagad', 'Rocket'].map(mfs => {
                            const config = mfs === 'bKash' 
                              ? { color: '#e2136e', bg: 'bg-[#e2136e]/10', border: 'border-[#e2136e]', text: 'text-[#e2136e]', hover: 'hover:border-[#e2136e]/40', circleBg: 'bg-[#e2136e]/5' }
                              : mfs === 'Nagad'
                              ? { color: '#f7901e', bg: 'bg-[#f7901e]/10', border: 'border-[#f7901e]', text: 'text-[#f7901e]', hover: 'hover:border-[#f7901e]/40', circleBg: 'bg-[#f7901e]/5' }
                              : { color: '#8c3494', bg: 'bg-[#8c3494]/10', border: 'border-[#8c3494]', text: 'text-[#8c3494]', hover: 'hover:border-[#8c3494]/40', circleBg: 'bg-[#8c3494]/5' };
                              
                            const isSelected = selectedMFS === mfs;
                            
                            return (
                              <button
                                key={mfs}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMFS(mfs);
                                }}
                                className={`border rounded-xl py-3 flex flex-col items-center justify-center gap-1 transition-all ${
                                  isSelected 
                                  ? `${config.border} ${config.bg} shadow-md scale-105` 
                                  : `bg-white border-[#F2EAE0] ${config.hover}`
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-white' : config.circleBg} ${config.text} transition-colors`}>
                                  {mfs[0]}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? config.text : 'text-[#8845e4]/80'}`}>{mfs}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* MFS Detail Form */}
                        <AnimatePresence>
                          {selectedMFS && detailConfig && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className={`mt-4 p-4 rounded-2xl border space-y-4 transition-all duration-300 ${detailConfig.bg} ${detailConfig.border}`}
                            >
                              <p className={`text-[10px] font-bold leading-tight ${detailConfig.text}`}>
                                Please send the total amount to our merchant number: <span className={detailConfig.textHighlight}>017XXXXXXXX</span>
                              </p>
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className={`text-[8px] font-black uppercase tracking-widest ml-1 ${detailConfig.labelText}`}>Your {selectedMFS} Number</label>
                                  <input 
                                    name="mfsNumber"
                                    value={formData.mfsNumber}
                                    onChange={handleInputChange}
                                    placeholder="01XXXXXXXXX"
                                    className={`w-full bg-white border-2 border-transparent px-4 py-3 rounded-xl outline-none text-xs font-bold transition-all ${detailConfig.inputFocus} ${detailConfig.text}`}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className={`text-[8px] font-black uppercase tracking-widest ml-1 ${detailConfig.labelText}`}>Transaction ID (TrxID)</label>
                                  <input 
                                    name="trxId"
                                    value={formData.trxId}
                                    onChange={handleInputChange}
                                    placeholder="8N7X..."
                                    className={`w-full bg-white border-2 border-transparent px-4 py-3 rounded-xl outline-none text-xs font-bold transition-all ${detailConfig.inputFocus} ${detailConfig.text}`}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* COD Option */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setPaymentMethod('cod');
                    setSelectedMFS(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (setPaymentMethod('cod'), setSelectedMFS(null))}
                  className={`w-full text-left p-6 rounded-3xl border-2 transition-all space-y-3 cursor-pointer ${
                    paymentMethod === 'cod' 
                    ? 'border-[#8845e4] bg-[#8845e4]/15' 
                    : 'border-[#F2EAE0] hover:border-[#8845e4]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'cod' ? 'bg-[#8845e4] text-white' : 'bg-[#F2EAE0] text-[#8845e4]'}`}>
                        <Truck size={20} />
                      </div>
                      <span className="font-bold text-[#8845e4]">Cash on Delivery</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#8845e4]' : 'border-[#F2EAE0]'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#8845e4]" />}
                    </div>
                  </div>
                  <p className="text-xs text-[#8845e4]/80 font-medium leading-relaxed">
                    Pay with cash when your shoes reach your doorstep. Available nationwide.
                  </p>
                </div>
              </div>

              {/* Trust Signals & CTA */}
              <div className="pt-6 space-y-6">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1.5 text-[#8845e4]/70">
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8845e4]/70">
                    <Award size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">100% Original</span>
                  </div>
                </div>

                <button 
                  disabled={isProcessing || isVerifying || cart.length === 0 || !isFormValid}
                  className="w-full bg-[#8845e4] text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#8845e4]/90 transition-all shadow-xl shadow-[#8845e4]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isProcessing || isVerifying ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                      />
                      {isVerifying ? 'Verifying...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                      {paymentMethod === 'online' ? 'Verify & Pay Now' : 'Confirm Order'}
                    </>
                  )}
                </button>

                <div className="flex justify-center gap-4 text-[10px] font-bold text-[#8845e4]/70 uppercase tracking-widest">
                  <a href="#" className="hover:text-[#8845e4] transition-colors">Return Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-[#8845e4] transition-colors">Terms of Service</a>
                </div>
              </div>
            </section>
          </div>

        </form>
      </div>
    </div>
  );
};
