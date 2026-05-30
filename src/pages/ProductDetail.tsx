import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  Share2, 
  Heart, 
  ShoppingBag, 
  Rotate3d, 
  ChevronRight, 
  ChevronLeft,
  Truck,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../services/api';
import { Product } from '../constants/products';

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('US 9');
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'reviews'>('specs');
  
  // Submit review state
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setIsLoading(true);
    
    // Fetch product details
    api.getProduct(id)
      .then(p => {
        if (!active) return;
        setProduct(p);
        setMainImage(p.image);
        setIsLoading(false);

        // Fetch related products
        api.getProducts()
          .then(list => {
            if (!active) return;
            const recs = list
              .filter(item => item.id !== p.id && ((item as any).custom_id !== p.id))
              .filter(item => item.category === p.category || item.gender === p.gender)
              .slice(0, 8);
            setRecommendations(recs);
          })
          .catch(console.error);

        // Fetch reviews
        api.getReviews(p.id)
          .then(revs => {
            if (active) setReviews(revs);
          })
          .catch(console.error);
      })
      .catch(err => {
        console.error(err);
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  // Update main image and reset scroll when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewerName.trim() || !comment.trim()) return;
    setIsSubmittingReview(true);
    api.createReview({
      product: product.id,
      reviewer_name: reviewerName,
      rating,
      comment
    })
      .then(newReview => {
        setReviews(prev => [newReview, ...prev]);
        setReviewerName('');
        setComment('');
        setRating(5);
        setIsSubmittingReview(false);
        setShowReviewSuccess(true);
        setTimeout(() => setShowReviewSuccess(false), 3000);
      })
      .catch(err => {
        console.error(err);
        setIsSubmittingReview(false);
      });
  };

  if (isLoading || !product) {
    return (
      <div className="pt-32 pb-32 text-center bg-[#F2EAE0] min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#8845e4]/20 border-t-[#8845e4] rounded-full mb-6"
        />
        <p className="text-lg font-bold text-[#8845e4] uppercase tracking-wider">Loading Stitch Details...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 bg-[#F2EAE0]">
      <Breadcrumbs />
      
      <div className="max-w-7xl mx-auto mt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold mb-12 text-[#8845e4] hover:text-[#BDA6CE] transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO SHOP
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Left: Interactive Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className={`aspect-square rounded-[3rem] overflow-hidden bg-white relative group shadow-2xl shadow-[#8845e4]/5`}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* 360° View Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-[#BDA6CE] text-white rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Rotate3d size={14} />
                360° View
              </div>

              <button 
                onClick={() => toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  color: product.color
                })}
                className={`absolute top-6 right-6 p-4 backdrop-blur-md rounded-2xl transition-all shadow-xl ${
                  isInWishlist(product.id)
                    ? 'bg-[#8845e4] text-white scale-110'
                    : 'bg-white/80 text-[#8845e4] hover:bg-white hover:scale-110'
                }`}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[product.image, product.hoverImage, product.image, product.hoverImage].map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    mainImage === img ? 'border-[#8845e4] scale-95' : 'border-transparent hover:border-[#8845e4]/30'
                  }`}
                >
                   <img 
                    src={img} 
                    alt={`${product.name} view ${i + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-[#BDA6CE]">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">128 Verified Reviews</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4 leading-tight text-[#8845e4]">
              {product.name}
            </h1>
            <p className="text-4xl font-display font-bold text-[#8845e4] mb-8">{product.price}</p>
            
            <p className="text-[#8845e4]/70 leading-relaxed mb-10 text-lg font-medium">
              {product.description}
            </p>

            <div className="space-y-10 mb-12">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-[#8845e4]/40">Select Your Size</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {['38', '39', '40', '41', '42', '43', '44', '45'].map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`aspect-square rounded-xl border-2 font-black transition-all flex items-center justify-center text-sm ${
                        selectedSize === size 
                          ? 'border-[#8845e4] bg-[#8845e4] text-white shadow-xl shadow-[#8845e4]/20 scale-105' 
                          : 'border-[#8845e4]/10 text-[#8845e4] hover:border-[#8845e4] hover:bg-[#8845e4]/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                  size: selectedSize
                })}
                className="flex-1 bg-[#8845e4] text-white py-6 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#8845e4]/90 transition-all hover:scale-[1.02] shadow-2xl shadow-[#8845e4]/20 group"
              >
                <ShoppingBag size={22} className="group-hover:rotate-12 transition-transform" />
                ADD TO BAG
              </button>
              <button className="p-6 border-2 border-[#8845e4]/10 rounded-3xl text-[#8845e4] hover:bg-[#B4D3D9]/20 transition-all hover:border-[#8845e4]/30">
                <Share2 size={24} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Interactive Details Section */}
        <div className="mb-32">
          <div className="flex border-b border-[#8845e4]/10 mb-12">
            {(['specs', 'shipping', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-[#8845e4]' : 'text-[#8845e4]/40 hover:text-[#8845e4]/60'
                }`}
              >
                {tab === 'specs' ? 'Tech Specs' : tab === 'shipping' ? 'Shipping & Returns' : 'Reviews'}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#8845e4] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="bg-[#B4D3D9]/10 rounded-[3rem] p-12 min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                >
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold text-[#8845e4]">Engineering Excellence</h4>
                    <p className="text-[#8845e4]/70 font-medium leading-relaxed">
                      Every Stitch shoe is a masterpiece of sustainable engineering. We combine high-performance materials with zero-waste manufacturing processes.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {product.specs.map(spec => (
                        <div key={spec} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#8845e4]/5 shadow-sm">
                          <ShieldCheck size={18} className="text-[#BDA6CE]" />
                          <span className="text-xs font-bold text-[#8845e4]">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-[2rem] p-8 space-y-4 shadow-sm border border-[#8845e4]/5">
                    <div className="flex justify-between items-center py-3 border-b border-[#F2EAE0]">
                      <span className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Weight</span>
                      <span className="text-sm font-black text-[#8845e4]">280g (Size 42)</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#F2EAE0]">
                      <span className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Sole Material</span>
                      <span className="text-sm font-black text-[#8845e4]">Algae-Based Foam</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-[#F2EAE0]">
                      <span className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Heel Drop</span>
                      <span className="text-sm font-black text-[#8845e4]">8mm</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Cushioning</span>
                      <span className="text-sm font-black text-[#8845e4]">High-Response</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-[#8845e4]/5 space-y-4">
                      <div className="w-12 h-12 bg-[#B4D3D9]/20 rounded-2xl flex items-center justify-center text-[#8845e4]">
                        <Truck size={24} />
                      </div>
                      <h4 className="font-bold text-[#8845e4]">Fast Delivery</h4>
                      <p className="text-xs text-[#8845e4]/60 font-medium leading-relaxed">
                        Inside Dhaka: 24-48 Hours<br />
                        Outside Dhaka: 3-5 Business Days
                      </p>
                    </div>
                    <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-[#8845e4]/5 space-y-4">
                      <div className="w-12 h-12 bg-[#BDA6CE]/20 rounded-2xl flex items-center justify-center text-[#8845e4]">
                        <Rotate3d size={24} />
                      </div>
                      <h4 className="font-bold text-[#8845e4]">Easy Returns</h4>
                      <p className="text-xs text-[#8845e4]/60 font-medium leading-relaxed">
                        7-day hassle-free return policy for unworn items in original packaging.
                      </p>
                    </div>
                    <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-[#8845e4]/5 space-y-4">
                      <div className="w-12 h-12 bg-[#8845e4]/10 rounded-2xl flex items-center justify-center text-[#8845e4]">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="font-bold text-[#8845e4]">Secure Shipping</h4>
                      <p className="text-xs text-[#8845e4]/60 font-medium leading-relaxed">
                        All orders are fully insured and tracked until they reach your doorstep.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h4 className="text-2xl font-display font-black text-[#8845e4]">Customer Love</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex text-[#BDA6CE]">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-xs font-bold text-[#8845e4]/60">
                          {reviews.length > 0
                            ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} out of 5`
                            : '4.9 out of 5'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inline Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-white p-8 rounded-[2rem] border border-[#8845e4]/10 space-y-4">
                    <h5 className="font-bold text-[#8845e4]">Share Your Experience</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block ml-2">Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Arif Hossain"
                          className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#8845e4] px-4 py-3 rounded-xl outline-none font-bold text-xs text-[#8845e4]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block ml-2">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(parseInt(e.target.value))}
                          className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#8845e4] px-4 py-3 rounded-xl outline-none font-bold text-xs text-[#8845e4] appearance-none cursor-pointer"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                          <option value="3">⭐⭐⭐ (3 Stars)</option>
                          <option value="2">⭐⭐ (2 Stars)</option>
                          <option value="1">⭐ (1 Star)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block ml-2">Review Content</label>
                      <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you think of the fit, comfort, and aesthetics?"
                        className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#8845e4] px-4 py-3 rounded-xl outline-none font-medium text-xs text-[#8845e4] min-h-[80px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-[#8845e4] text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-[#BDA6CE] transition-all disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                    {showReviewSuccess && (
                      <span className="text-xs text-green-600 font-bold ml-4">Review posted successfully!</span>
                    )}
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-8 bg-white rounded-[2rem] shadow-sm border border-[#8845e4]/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#F2EAE0] rounded-full flex items-center justify-center font-bold text-[#8845e4]">
                                {(rev.reviewer_name || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#8845e4]">{rev.reviewer_name}</p>
                                <p className="text-[10px] text-[#8845e4]/40 font-bold uppercase tracking-widest">Verified Buyer</p>
                              </div>
                            </div>
                            <div className="flex text-[#BDA6CE]">
                              {Array.from({ length: rev.rating || 5 }).map((_, j) => (
                                <Star key={j} size={12} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-[#8845e4]/70 font-medium leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))
                    ) : (
                      // Fallback reviews
                      [
                        { name: 'Tanvir Ahmed', text: 'The most comfortable pair of shoes I have ever owned. The Aero-Stitch V1 is a game changer for my daily commute.', rating: 5 },
                        { name: 'Nusrat Sharmin', text: 'Absolutely love the design and the color. It fits perfectly and feels so light on my feet.', rating: 5 }
                      ].map((mock, idx) => (
                        <div key={idx} className="p-8 bg-white rounded-[2rem] shadow-sm border border-[#8845e4]/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#F2EAE0] rounded-full flex items-center justify-center font-bold text-[#8845e4]">
                                {mock.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#8845e4]">{mock.name}</p>
                                <p className="text-[10px] text-[#8845e4]/40 font-bold uppercase tracking-widest">Verified Buyer</p>
                              </div>
                            </div>
                            <div className="flex text-[#BDA6CE]">
                              {[1, 2, 3, 4, 5].map(j => <Star key={j} size={12} fill="currentColor" />)}
                            </div>
                          </div>
                          <p className="text-sm text-[#8845e4]/70 font-medium leading-relaxed italic">
                            "{mock.text}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recommendation Engine */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-[#8845e4] uppercase">
                Related Stitches
              </h2>
              <p className="text-[#8845e4]/60 font-medium mt-2">Complete your collection with these pairs.</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scroll('left')}
                className="p-4 rounded-2xl border-2 border-[#8845e4]/10 text-[#8845e4] hover:bg-white hover:border-[#8845e4] transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-4 rounded-2xl border-2 border-[#8845e4]/10 text-[#8845e4] hover:bg-white hover:border-[#8845e4] transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory custom-scrollbar scroll-smooth"
          >
            {recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                className="min-w-[280px] md:min-w-[320px] snap-start group"
                whileHover={{ y: -10 }}
              >
                <Link to={`/product/${rec.id}`}>
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-[#8845e4]/5 border border-[#8845e4]/5 transition-all group-hover:shadow-2xl group-hover:shadow-[#8845e4]/10 relative">
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img 
                        src={rec.image} 
                        alt={rec.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-[#8845e4]/0 group-hover:bg-[#8845e4]/10 backdrop-blur-[1px] transition-all duration-500" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-[#8845e4] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#8845e4]/40 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                          View Details
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-[#8845e4] group-hover:text-[#BDA6CE] transition-colors">{rec.name}</h3>
                        <span className="font-black text-[#8845e4]">{rec.price}</span>
                      </div>
                      <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">{rec.category} • {rec.gender}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
