import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'motion/react';
import { api } from '../../services/api';

export const Dashboard = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getDashboardStats()
      .then(data => {
        if (active) {
          setStatsData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (isLoading || !statsData) {
    return (
      <div className="pt-32 pb-32 text-center bg-white rounded-[3rem] border border-[#8845e4]/5 min-h-[400px] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#8845e4]/20 border-t-[#8845e4] rounded-full mb-4"
        />
        <p className="text-sm font-bold text-[#8845e4] uppercase tracking-wider">Loading Dashboard Stats...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: statsData.revenue, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Orders', value: String(statsData.active_orders), change: '+5.2%', trend: 'up', icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'New Customers', value: String(statsData.new_customers), change: '-2.4%', trend: 'down', icon: Users, color: 'bg-teal-50 text-teal-600' },
    { label: 'Conversion Rate', value: statsData.conversion_rate, change: '+0.8%', trend: 'up', icon: Activity, color: 'bg-orange-50 text-orange-600' },
  ];

  const categoryColors = ['#8845e4', '#B4D3D9', '#BDA6CE', '#F2EAE0'];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">The Pulse</h1>
          <p className="text-[#8845e4]/60 font-medium">Real-time overview of your Stitch empire.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-[#8845e4]/10">
          {['24h', '7d', '30d', '12m'].map((range) => (
            <button 
              key={range}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                range === '7d' ? 'bg-[#8845e4] text-white shadow-md' : 'text-[#8845e4]/40 hover:text-[#8845e4]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-[#8845e4]/5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-display font-black text-[#8845e4]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-[#8845e4]/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[#8845e4] uppercase tracking-tight">Revenue Performance</h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8845e4] rounded-full"></div>
                <span className="text-[#8845e4]/60">Current Period</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData.sales_chart}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8845e4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8845e4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8845e4" strokeOpacity={0.05} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8845e4', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8845e4', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(155, 142, 199, 0.2)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8845e4" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-[#8845e4]/5 shadow-sm">
          <h3 className="font-bold text-[#8845e4] uppercase tracking-tight mb-8">Top Categories</h3>
          <div className="space-y-6">
            {statsData.categories.map((cat: any, idx: number) => (
              <div key={cat.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#8845e4]">{cat.label}</span>
                  <span className="text-[#8845e4]/40">{cat.value}%</span>
                </div>
                <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color || categoryColors[idx % categoryColors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-[#F2EAE0]/30 rounded-[2rem] border border-[#8845e4]/5">
            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest mb-2">Insight of the day</p>
            <p className="text-xs font-bold text-[#8845e4] leading-relaxed">
              Lifestyle Sneakers are trending up in Dhaka. Consider boosting marketing for the "Cloud Walker" series.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
