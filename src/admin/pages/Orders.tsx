import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  Package,
  MapPin,
  CreditCard,
  ChevronRight,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const initialOrders = [
  { 
    id: '#ORD-9401', 
    customer: 'Tanvir Ahmed', 
    email: 'tanvir@example.com',
    date: 'Oct 12, 2023', 
    total: '$245.00', 
    status: 'Delivered', 
    payment: 'bKash',
    address: 'House 12, Road 5, Dhanmondi, Dhaka',
    items: [
      { name: 'Cloud Walker Pro', size: 42, price: '$120.00', qty: 1 },
      { name: 'Neon Sprint', size: 41, price: '$125.00', qty: 1 }
    ],
    timeline: [
      { status: 'Pending', date: 'Oct 12, 10:00 AM', completed: true },
      { status: 'Confirmed', date: 'Oct 12, 11:30 AM', completed: true },
      { status: 'Shipped', date: 'Oct 13, 02:00 PM', completed: true },
      { status: 'Delivered', date: 'Oct 15, 04:00 PM', completed: true }
    ],
    courier: { name: 'Pathao', trackingId: 'PTH-882910' }
  },
  { 
    id: '#ORD-9402', 
    customer: 'Nesha Isnan', 
    email: 'nesha@example.com',
    date: 'Oct 12, 2023', 
    total: '$120.00', 
    status: 'Processing', 
    payment: 'COD',
    address: 'Plot 4, Sector 7, Uttara, Dhaka',
    items: [{ name: 'Pastel Runner', size: 39, price: '$120.00', qty: 1 }],
    timeline: [
      { status: 'Pending', date: 'Oct 12, 12:00 PM', completed: true },
      { status: 'Confirmed', date: 'Oct 12, 01:00 PM', completed: true },
      { status: 'Shipped', date: '-', completed: false },
      { status: 'Delivered', date: '-', completed: false }
    ],
    courier: { name: '', trackingId: '' }
  },
  { id: '#ORD-9403', customer: 'Arif Hossain', date: 'Oct 11, 2023', total: '$380.00', status: 'Shipped', payment: 'Nagad' },
  { id: '#ORD-9404', customer: 'Sumi Akter', date: 'Oct 11, 2023', total: '$95.00', status: 'Pending', payment: 'Rocket' },
  { id: '#ORD-9405', customer: 'Kamal Pasha', date: 'Oct 10, 2023', total: '$145.00', status: 'Cancelled', payment: 'COD' },
];

const statusOptions = [
  { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Shipped', color: 'bg-[#8845e4]/20 text-[#8845e4] border-[#8845e4]/30' },
  { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200' },
  { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
];

const getStatusStyles = (status: string) => {
  const option = statusOptions.find(o => o.label === status);
  return option ? option.color : 'bg-gray-100 text-gray-700 border-gray-200';
};

export const Orders = () => {
  const [orders, setOrders] = useState<any>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Webhook Simulation
        if (newStatus === 'Shipped') {
          console.log(`[WEBHOOK] Sending automated shipping email to ${o.email || 'customer'}...`);
          console.log(`[EMAIL CONTENT] Your order ${o.id} has been shipped via ${o.courier?.name || 'our courier'}. Tracking ID: ${o.courier?.trackingId || 'N/A'}`);
        }
        return { ...o, status: newStatus };
      }
      return o;
    }));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const updateCourier = (orderId: string, field: string, value: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, courier: { ...o.courier, [field]: value } };
      }
      return o;
    }));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, courier: { ...selectedOrder.courier, [field]: value } });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Orders</h1>
          <p className="text-[#8845e4]/60 font-medium">Fulfill orders and reconcile payments.</p>
        </div>
        <button className="bg-white border border-[#8845e4]/10 text-[#8845e4] px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/5 transition-all shadow-sm">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', count: 12, color: 'text-yellow-600' },
          { label: 'Confirmed', count: 8, color: 'text-blue-600' },
          { label: 'Shipped', count: 24, color: 'text-[#8845e4]' },
          { label: 'Delivered', count: 142, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-[#8845e4]/5 shadow-sm">
            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-display font-black ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[3rem] border border-[#8845e4]/5 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#8845e4]/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8845e4]/40" />
            <input 
              type="text" 
              placeholder="Search by order ID or customer..." 
              className="w-full bg-[#F8F9FA] border-none px-12 py-3 rounded-xl outline-none text-sm font-medium text-[#8845e4] placeholder:text-[#8845e4]/30"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-3 bg-[#F8F9FA] rounded-xl text-xs font-bold text-[#8845e4] flex items-center gap-2 hover:bg-[#8845e4]/5 transition-all">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]/50 border-b border-[#8845e4]/5">
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Total</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8845e4]/5">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-[#8845e4]/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-bold text-[#8845e4] text-sm">{order.id}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]/60">{order.customer}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]/40">{order.date}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-[#8845e4]">{order.total}</span>
                </td>
                <td className="px-8 py-6">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${getStatusStyles(order.status)}`}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.label} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-[#8845e4]/40 hover:text-[#8845e4] hover:bg-[#8845e4]/5 rounded-lg transition-all"
                  >
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-[#1A1A1A]/20 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl h-full rounded-l-[3rem] shadow-2xl overflow-y-auto border-l border-[#8845e4]/10 flex flex-col"
            >
              <div className="p-8 border-b border-[#8845e4]/5 flex items-center justify-between bg-[#F8F9FA]">
                <div>
                  <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight">Order Details</h3>
                  <p className="text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">{selectedOrder.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-[#8845e4]/5 rounded-full text-[#8845e4]/40 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 p-8 space-y-8">
                {/* Order Summary Card */}
                <div className="bg-[#B4D3D9]/20 p-8 rounded-[2.5rem] border border-[#B4D3D9]/30 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-2xl text-[#8845e4]">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Status</p>
                        <p className="font-bold text-[#8845e4]">{selectedOrder.status}</p>
                      </div>
                    </div>
                    <button className="bg-[#8845e4] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#8845e4]/90 transition-all">
                      Update Status
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#B4D3D9]/30">
                    <div>
                      <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-2">Customer</p>
                      <p className="text-sm font-bold text-[#8845e4]">{selectedOrder.customer}</p>
                      <p className="text-xs text-[#8845e4]/60">{selectedOrder.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-2">Payment</p>
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-[#8845e4]/40" />
                        <p className="text-sm font-bold text-[#8845e4]">{selectedOrder.payment}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-2">Shipping Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-[#8845e4]/40 mt-1" />
                      <p className="text-sm font-bold text-[#8845e4] leading-relaxed">{selectedOrder.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest">Order Timeline</h4>
                  <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#8845e4]/10">
                    {(selectedOrder.timeline || [
                      { status: 'Pending', date: selectedOrder.date, completed: true },
                      { status: 'Confirmed', date: '-', completed: false },
                      { status: 'Shipped', date: '-', completed: false },
                      { status: 'Delivered', date: '-', completed: false }
                    ]).map((step: any, i: number) => (
                      <div key={i} className="flex items-start gap-6 relative">
                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0 z-10 ${step.completed ? 'bg-[#8845e4]' : 'bg-gray-200'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${step.completed ? 'text-[#8845e4]' : 'text-[#8845e4]/40'}`}>{step.status}</p>
                          <p className="text-xs text-[#8845e4]/40">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courier Integration */}
                <div className="bg-[#F8F9FA] p-8 rounded-[2.5rem] border border-[#8845e4]/5 space-y-6">
                  <h4 className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest">Courier Integration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Courier Name</label>
                      <select 
                        value={selectedOrder.courier?.name || ''}
                        onChange={(e) => updateCourier(selectedOrder.id, 'name', e.target.value)}
                        className="w-full bg-white border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-bold text-sm text-[#8845e4]"
                      >
                        <option value="">Select Courier</option>
                        <option value="Pathao">Pathao</option>
                        <option value="Steadfast">Steadfast</option>
                        <option value="RedX">RedX</option>
                        <option value="Paperfly">Paperfly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Tracking ID</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Enter ID..."
                          value={selectedOrder.courier?.trackingId || ''}
                          onChange={(e) => updateCourier(selectedOrder.id, 'trackingId', e.target.value)}
                          className="w-full bg-white border border-[#8845e4]/10 px-4 py-3 rounded-xl outline-none focus:border-[#8845e4] transition-all font-bold text-sm text-[#8845e4]"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#8845e4]/40 hover:text-[#8845e4]">
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest">Order Items</h4>
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#8845e4]/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#F2EAE0] rounded-xl flex items-center justify-center text-[#8845e4]">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#8845e4]">{item.name}</p>
                            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Size {item.size} • Qty {item.qty}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-[#8845e4]">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#F8F9FA] border-t border-[#8845e4]/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#8845e4]/40">
                  <Clock size={16} />
                  <span className="text-xs font-bold">Last updated: 2 mins ago</span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#8845e4] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
