import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  Trash2, 
  Reply, 
  Search, 
  Filter,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const initialReviews = [
  { 
    id: 'REV-001', 
    customer: 'Tanvir Ahmed', 
    product: 'Cloud Walker Pro', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100',
    rating: 5, 
    text: 'Absolutely the most comfortable shoes I have ever worn. The cushioning is next level!',
    date: 'Oct 12, 2023',
    status: 'Pending'
  },
  { 
    id: 'REV-002', 
    customer: 'Nesha Isnan', 
    product: 'Neon Sprint', 
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=100',
    rating: 2, 
    text: 'The color is great but the sizing runs very small. Had to return them.',
    date: 'Oct 11, 2023',
    status: 'Pending'
  },
  { 
    id: 'REV-003', 
    customer: 'Arif Hossain', 
    product: 'Midnight Oxford', 
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=100',
    rating: 4, 
    text: 'Very stylish for formal events. A bit stiff at first but breaks in nicely.',
    date: 'Oct 10, 2023',
    status: 'Approved'
  },
];

export const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedReviews(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    setReviews(prev => prev.map(r => 
      selectedReviews.includes(r.id) ? { ...r, status: 'Approved' } : r
    ));
    setSelectedReviews([]);
  };

  const handleBulkDelete = () => {
    setReviews(prev => prev.filter(r => !selectedReviews.includes(r.id)));
    setSelectedReviews([]);
  };

  const getSentiment = (rating: number) => {
    if (rating >= 4) return { label: 'Positive', color: 'bg-green-100 text-green-700' };
    if (rating <= 2) return { label: 'Negative', color: 'bg-red-100 text-red-700' };
    return { label: 'Neutral', color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Review Moderation</h1>
          <p className="text-[#8845e4]/60 font-medium">Manage customer feedback and sentiment.</p>
        </div>
        
        <div className="flex gap-4">
          <AnimatePresence>
            {selectedReviews.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-3"
              >
                <button 
                  onClick={handleBulkApprove}
                  className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                >
                  <CheckCircle2 size={18} />
                  Approve ({selectedReviews.length})
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const sentiment = getSentiment(review.rating);
          return (
            <motion.div 
              key={review.id}
              layout
              className={`bg-white p-6 rounded-[2.5rem] border transition-all ${selectedReviews.includes(review.id) ? 'border-[#8845e4] shadow-lg shadow-[#8845e4]/10' : 'border-[#8845e4]/5 shadow-sm'}`}
            >
              <div className="flex gap-6">
                <div className="pt-1">
                  <input 
                    type="checkbox" 
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => toggleSelect(review.id)}
                    className="w-5 h-5 rounded-lg border-[#8845e4]/20 text-[#8845e4] focus:ring-[#8845e4]"
                  />
                </div>
                
                <div className="w-20 h-20 bg-[#F2EAE0] rounded-2xl overflow-hidden shrink-0">
                  <img src={review.image} alt={review.product} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-[#8845e4]">{review.customer}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sentiment.color}`}>
                          {sentiment.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Reviewed: {review.product}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm font-medium text-[#8845e4]/80 leading-relaxed italic">
                    "{review.text}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                        className="flex items-center gap-2 text-xs font-bold text-[#8845e4] hover:underline"
                      >
                        <Reply size={14} />
                        Reply as Stitch Admin
                      </button>
                      {review.status === 'Pending' && (
                        <button 
                          onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status: 'Approved' } : r))}
                          className="flex items-center gap-2 text-xs font-bold text-green-600 hover:underline"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-[#8845e4]/30 uppercase tracking-widest">{review.date}</span>
                  </div>

                  <AnimatePresence>
                    {replyingTo === review.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4"
                      >
                        <div className="relative">
                          <textarea 
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 rounded-2xl p-4 text-sm font-medium outline-none focus:border-[#8845e4] transition-all min-h-[100px]"
                          />
                          <button 
                            onClick={() => {
                              console.log(`Replied to ${review.id}: ${replyText}`);
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="absolute bottom-4 right-4 bg-[#8845e4] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#8845e4]/90 transition-all"
                          >
                            Send Reply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
