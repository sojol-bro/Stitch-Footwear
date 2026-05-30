import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  TrendingUp,
  X,
  ExternalLink,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const initialCustomers = [
  { 
    id: 'C-001', 
    name: 'Tanvir Ahmed', 
    email: 'tanvir@example.com', 
    phone: '+8801712345678',
    orders: 12, 
    spend: '$1,240.00', 
    joined: 'Oct 12, 2023',
    mostPurchasedSize: 42,
    orderHistory: [
      { id: '#ORD-9401', date: 'Oct 12, 2023', total: '$245.00', status: 'Delivered' },
      { id: '#ORD-9350', date: 'Sep 28, 2023', total: '$120.00', status: 'Delivered' },
      { id: '#ORD-9210', date: 'Aug 15, 2023', total: '$180.00', status: 'Delivered' },
    ]
  },
  { 
    id: 'C-002', 
    name: 'Nesha Isnan', 
    email: 'nesha@example.com', 
    phone: '+8801812345679',
    orders: 5, 
    spend: '$580.00', 
    joined: 'Oct 11, 2023',
    mostPurchasedSize: 39,
    orderHistory: [
      { id: '#ORD-9402', date: 'Oct 12, 2023', total: '$120.00', status: 'Processing' },
    ]
  },
  { 
    id: 'C-003', 
    name: 'Arif Hossain', 
    email: 'arif@example.com', 
    phone: '+8801912345680',
    orders: 24, 
    spend: '$3,840.00', 
    joined: 'Sep 20, 2023',
    mostPurchasedSize: 43,
    orderHistory: [
      { id: '#ORD-9403', date: 'Oct 11, 2023', total: '$380.00', status: 'Shipped' },
    ]
  },
];

export const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setNewCustomer({ ...newCustomer, email });
    if (email && !validateEmail(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(newCustomer.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // In a real app, we would save to database here
    console.log('Adding customer:', newCustomer);
    setIsAddingCustomer(false);
    setNewCustomer({ name: '', email: '', phone: '' });
    setEmailError('');
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Phone,Orders,Spend,Joined\n"
      + initialCustomers.map(c => `${c.name},${c.email},${c.phone},${c.orders},${c.spend},${c.joined}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stitch_customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = initialCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Customer CRM</h1>
          <p className="text-[#8845e4]/60 font-medium">Manage your community and track loyalty.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="bg-white border border-[#8845e4]/10 text-[#8845e4] px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/5 transition-all shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddingCustomer(true)}
            className="bg-[#8845e4] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
          >
            <UserPlus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Customers', value: '1,248', icon: Users, color: 'text-blue-500' },
          { label: 'Active This Month', value: '482', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Avg. Order Value', value: '$142.50', icon: ShoppingBag, color: 'text-[#8845e4]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-[#8845e4]/5 shadow-sm flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-[#F8F9FA] ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-display font-black text-[#8845e4]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-[3rem] border border-[#8845e4]/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#8845e4]/5">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8845e4]/40" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F9FA] border-none px-12 py-4 rounded-2xl outline-none text-sm font-medium text-[#8845e4] placeholder:text-[#8845e4]/30"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]/50 border-b border-[#8845e4]/5">
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Contact</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Orders</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Total Spend</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Joined Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8845e4]/5">
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                className="hover:bg-[#B4D3D9]/10 transition-colors group cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F2EAE0] rounded-full flex items-center justify-center text-[#8845e4] font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[#8845e4] text-sm">{customer.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#8845e4]/60 flex items-center gap-2">
                      <Mail size={12} className="text-[#8845e4]/30" />
                      {customer.email}
                    </p>
                    <p className="text-xs font-medium text-[#8845e4]/60 flex items-center gap-2">
                      <Phone size={12} className="text-[#8845e4]/30" />
                      {customer.phone}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]">{customer.orders} orders</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]">{customer.spend}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]/40">{customer.joined}</span>
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

      {/* Customer Profile Slide-over */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-[#1A1A1A]/20 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-xl h-full rounded-l-[3rem] shadow-2xl overflow-y-auto border-l border-[#8845e4]/10 flex flex-col"
            >
              <div className="p-8 border-b border-[#8845e4]/5 flex items-center justify-between bg-[#F8F9FA]">
                <div>
                  <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight">Customer Profile</h3>
                  <p className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">{selectedCustomer.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-[#8845e4]/5 rounded-full text-[#8845e4]/40 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 p-8 space-y-8">
                {/* Header Info */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-[#B4D3D9] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black italic shadow-lg shadow-[#B4D3D9]/20">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-[#8845e4] uppercase tracking-tight">{selectedCustomer.name}</h2>
                    <p className="text-sm font-bold text-[#8845e4]/40">Member since {selectedCustomer.joined}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-[#8845e4]/10 text-[#8845e4] rounded-full text-[10px] font-black uppercase tracking-widest">VIP Customer</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8F9FA] p-6 rounded-[2rem] border border-[#8845e4]/5">
                    <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-1">Total Spend</p>
                    <p className="text-xl font-display font-black text-[#8845e4]">{selectedCustomer.spend}</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-6 rounded-[2rem] border border-[#8845e4]/5">
                    <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-1">Shoe Size</p>
                    <p className="text-xl font-display font-black text-[#8845e4]">{selectedCustomer.mostPurchasedSize}</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-white border border-[#8845e4]/5 rounded-2xl">
                      <Mail size={18} className="text-[#8845e4]/40" />
                      <p className="text-sm font-bold text-[#8845e4]">{selectedCustomer.email}</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white border border-[#8845e4]/5 rounded-2xl">
                      <Phone size={18} className="text-[#8845e4]/40" />
                      <p className="text-sm font-bold text-[#8845e4]">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest">Order History</h4>
                  <div className="space-y-3">
                    {selectedCustomer.orderHistory.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-[#8845e4]/5 rounded-2xl hover:border-[#8845e4]/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#8845e4]">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#8845e4]">{order.id}</p>
                            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#8845e4]">{order.total}</p>
                          <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#F8F9FA] border-t border-[#8845e4]/5 flex justify-end">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="bg-[#8845e4] text-white px-12 py-4 rounded-2xl font-bold text-sm hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isAddingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-[#8845e4]/10"
            >
              <div className="p-8 border-b border-[#8845e4]/5 flex items-center justify-between bg-[#F8F9FA]">
                <div>
                  <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight">Add New Customer</h3>
                  <p className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">Expand the Stitch community</p>
                </div>
                <button 
                  onClick={() => setIsAddingCustomer(false)}
                  className="p-2 hover:bg-[#8845e4]/5 rounded-full text-[#8845e4]/40 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newCustomer.email}
                    onChange={handleEmailChange}
                    placeholder="e.g. john@example.com"
                    className={`w-full bg-[#F8F9FA] border px-6 py-4 rounded-2xl outline-none transition-all font-bold text-[#8845e4] ${
                      emailError ? 'border-red-500 focus:border-red-500' : 'border-[#8845e4]/10 focus:border-[#8845e4]'
                    }`}
                  />
                  {emailError && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="e.g. +8801712345678"
                    className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddingCustomer(false)}
                    className="px-6 py-3 text-[#8845e4] font-bold text-sm hover:underline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#8845e4] text-white px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
                  >
                    <UserPlus size={18} />
                    Add Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
