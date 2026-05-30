import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Save,
  RefreshCw,
  Percent,
  Upload,
  Video,
  Globe,
  Tag,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../services/api';
import { Product } from '../../constants/products';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Live': return 'bg-green-50 text-green-600 border-green-100';
    case 'Hidden': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Archive': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

export const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    category: 'Lifestyle',
    tags: [] as string[],
    regularPrice: '',
    discountPrice: '',
    metaDescription: '',
    altText: '',
    inventory: { 38: 10, 39: 10, 40: 10, 41: 10, 42: 10, 43: 10, 44: 10, 45: 10 } as any
  });

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

  const getTotalStock = (inventory: any) => {
    if (!inventory) return 0;
    return Object.values(inventory).reduce((a: any, b: any) => Number(a) + Number(b), 0);
  };

  const handleStatusToggle = (id: string) => {
    const product = products.find(p => p.id === id || p.custom_id === id);
    if (!product) return;
    const nextStatus = product.status === 'Live' ? 'Hidden' : product.status === 'Hidden' ? 'Archive' : 'Live';
    api.updateProduct(id, { status: nextStatus })
      .then(updated => {
        setProducts(prev => prev.map(p => (p.id === id || p.custom_id === id) ? updated : p));
      })
      .catch(console.error);
  };

  const handleBulkReset = () => {
    if (confirm('Are you sure you want to reset all stock to zero?')) {
      const promises = products.map(p => {
        const resetInventory = Object.keys(p.inventory || {}).reduce((acc, size) => ({ ...acc, [size]: 0 }), {});
        return api.updateProduct(p.id, { inventory: resetInventory });
      });
      Promise.all(promises)
        .then(updatedProds => {
          setProducts(updatedProds);
        })
        .catch(console.error);
    }
  };

  const handleBulkDiscount = () => {
    const promises = products.map(p => {
      const priceRaw = typeof p.price === 'string' ? parseFloat(p.price.replace('$', '')) : Number(p.price);
      const discountedPrice = Math.round(priceRaw * 0.9);
      return api.updateProduct(p.id, { price: discountedPrice });
    });
    Promise.all(promises)
      .then(updatedProds => {
        setProducts(updatedProds);
      })
      .catch(console.error);
  };

  const handleUpdateStock = (size: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingProduct({
      ...editingProduct,
      inventory: { ...editingProduct.inventory, [size]: numValue }
    });
  };

  const saveStock = () => {
    api.updateProduct(editingProduct.id, { inventory: editingProduct.inventory })
      .then(updated => {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        setEditingProduct(null);
      })
      .catch(console.error);
  };

  const toggleTag = (tag: string) => {
    setNewProduct(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handlePublishProductSubmit = () => {
    api.createProduct({
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.regularPrice) || 0,
      inventory: newProduct.inventory,
      description: newProduct.metaDescription,
      slug: newProduct.slug,
      tags: newProduct.tags,
      status: 'Live'
    })
      .then(created => {
        setProducts(prev => [...prev, created]);
        setIsAddingProduct(false);
        setNewProduct({
          name: '',
          slug: '',
          category: 'Lifestyle',
          tags: [],
          regularPrice: '',
          discountPrice: '',
          metaDescription: '',
          altText: '',
          inventory: { 38: 10, 39: 10, 40: 10, 41: 10, 42: 10, 43: 10, 44: 10, 45: 10 }
        });
      })
      .catch(console.error);
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => {
    const term = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.custom_id || p.id).toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Inventory</h1>
          <p className="text-[#8845e4]/60 font-medium">Manage your product lifecycle and stock levels.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleBulkReset}
            className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-50 transition-all"
          >
            <RefreshCw size={18} />
            Reset All Stock
          </button>
          <button 
            onClick={handleBulkDiscount}
            className="px-6 py-3 bg-white border border-teal-100 text-teal-600 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-teal-50 transition-all"
          >
            <Percent size={18} />
            Apply 10% Discount
          </button>
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="bg-[#8845e4] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8845e4]/40" />
          <input 
            type="text" 
            placeholder="Search by name, SKU, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#8845e4]/10 px-12 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-medium text-sm text-[#8845e4]"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-[#8845e4]/10 rounded-2xl font-bold text-sm text-[#8845e4] flex items-center gap-2 hover:bg-[#8845e4]/5 transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[3rem] border border-[#8845e4]/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#8845e4]/5">
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Product</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Category</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Total Stock</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Price</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8845e4]/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#8845e4]/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F2EAE0] rounded-xl overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-[#8845e4] text-sm">{product.name}</p>
                      <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]/60">{product.category}</span>
                </td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="flex items-center gap-2 text-sm font-bold text-[#8845e4] hover:underline"
                  >
                    {getTotalStock(product.inventory)} units
                    <ArrowUpDown size={14} className="text-[#8845e4]/40" />
                  </button>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]">${product.price}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleStatusToggle(product.id)}
                      className={`w-10 h-5 rounded-full relative transition-all ${product.status === 'Live' ? 'bg-green-500' : product.status === 'Hidden' ? 'bg-orange-400' : 'bg-red-400'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${product.status === 'Live' ? 'right-1' : 'left-1'}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${getStatusStyles(product.status).split(' ')[1]}`}>
                      {product.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-[#8845e4]/40 hover:text-[#8845e4] hover:bg-[#8845e4]/5 rounded-lg transition-all">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden border border-[#8845e4]/10 flex flex-col"
            >
              <div className="p-8 border-b border-[#8845e4]/5 flex items-center justify-between bg-[#F8F9FA]">
                <div>
                  <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight">Add New Product</h3>
                  <p className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Create a new footwear masterpiece</p>
                </div>
                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="p-2 hover:bg-[#8845e4]/5 rounded-full text-[#8845e4]/40 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column: Media */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">Product Images (High-Res PNG)</label>
                      <div className="border-2 border-dashed border-[#8845e4]/20 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 bg-[#F8F9FA] hover:bg-[#8845e4]/5 transition-all group cursor-pointer">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#8845e4] shadow-sm group-hover:scale-110 transition-transform">
                          <Upload size={32} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-[#8845e4]">Drag and drop images here</p>
                          <p className="text-xs text-[#8845e4]/40">Supports PNG, JPG, WebP (Max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">360° Turntable Video (.mp4)</label>
                      <div className="border border-[#8845e4]/10 rounded-[2rem] p-8 flex items-center gap-6 bg-white">
                        <div className="w-12 h-12 bg-[#8845e4]/10 rounded-xl flex items-center justify-center text-[#8845e4]">
                          <Video size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#8845e4]">Upload 360° View</p>
                          <p className="text-[10px] text-[#8845e4]/40">Recommended: 1080x1080, 30fps</p>
                        </div>
                        <button className="px-4 py-2 bg-[#F8F9FA] rounded-xl text-xs font-bold text-[#8845e4] hover:bg-[#8845e4]/5 transition-all">
                          Select File
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">SEO Section</label>
                      <div className="bg-[#F8F9FA] p-8 rounded-[2.5rem] border border-[#8845e4]/5 space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">
                            <Globe size={12} />
                            URL Slug
                          </div>
                          <input 
                            type="text" 
                            placeholder="e.g. cloud-walker-pro"
                            className="w-full bg-white border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-bold text-sm text-[#8845e4]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Meta Description</label>
                          <textarea 
                            placeholder="SEO description for search engines..."
                            className="w-full bg-white border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-medium text-sm text-[#8845e4] min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Image Alt Text</label>
                          <input 
                            type="text" 
                            placeholder="Describe the product for accessibility..."
                            className="w-full bg-white border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-bold text-sm text-[#8845e4]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Data */}
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">Product Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter name..."
                          className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">Category</label>
                        <select className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]">
                          <option value="">Select Category</option>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Athletic">Athletic</option>
                          <option value="Formal">Formal</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">Tags & Collections</label>
                      <div className="flex flex-wrap gap-2">
                        {['Men', 'Women', 'New Arrival', 'Formal', 'Sneaker', 'Limited Edition'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                              newProduct.tags.includes(tag) 
                                ? 'bg-[#8845e4] text-white border-[#8845e4]' 
                                : 'bg-white text-[#8845e4]/40 border-[#8845e4]/10 hover:border-[#8845e4]/40'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">Pricing</label>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">
                            <DollarSign size={12} />
                            Regular Price
                          </div>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">
                            <Percent size={12} />
                            Discount Price
                          </div>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest block">Variant Matrix (Stock by Size)</label>
                      <div className="bg-[#F8F9FA] p-8 rounded-[2.5rem] border border-[#8845e4]/5">
                        <div className="grid grid-cols-4 gap-4">
                          {[38, 39, 40, 41, 42, 43, 44, 45].map(size => (
                            <div key={size} className="space-y-2">
                              <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Size {size}</label>
                              <input 
                                type="number" 
                                defaultValue={0}
                                className="w-full bg-white border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#F8F9FA] border-t border-[#8845e4]/5 flex justify-end gap-4">
                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="px-8 py-4 text-[#8845e4] font-bold text-sm hover:underline"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="bg-[#8845e4] text-white px-12 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
                >
                  <Save size={18} />
                  Publish Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stock Matrix Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-[#8845e4]/10"
            >
              <div className="p-8 border-b border-[#8845e4]/5 flex items-center justify-between bg-[#F8F9FA]">
                <div>
                  <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight">Stock Matrix</h3>
                  <p className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">{editingProduct.name} ({editingProduct.id})</p>
                </div>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="p-2 hover:bg-[#8845e4]/5 rounded-full text-[#8845e4]/40 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(editingProduct.inventory).map(([size, stock]: any) => (
                    <div key={size} className="space-y-2">
                      <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Size {size}</label>
                      <input 
                        type="number" 
                        value={stock}
                        onChange={(e) => handleUpdateStock(parseInt(size), e.target.value)}
                        className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-[#F8F9FA] border-t border-[#8845e4]/5 flex justify-end gap-4">
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 text-[#8845e4] font-bold text-sm hover:underline"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveStock}
                  className="bg-[#8845e4] text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
