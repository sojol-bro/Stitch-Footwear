import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Palette,
  LogOut,
  Bell,
  Search,
  MessageSquare,
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'The Pulse', path: '/admin' },
  { icon: Palette, label: 'Design System', path: '/admin/design' },
  { icon: Package, label: 'Inventory', path: '/admin/inventory' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
  { icon: Mail, label: 'Communications', path: '/admin/communications' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-[#1A1A1A]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#8845e4]/10 flex flex-col">
        <div className="p-8">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8845e4] rounded-lg flex items-center justify-center text-white font-black italic">S</div>
            <span className="font-display font-black text-xl tracking-tighter text-[#8845e4] uppercase">Stitch Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-[#8845e4] text-white shadow-lg shadow-[#8845e4]/20' 
                    : 'text-[#8845e4]/60 hover:bg-[#8845e4]/5 hover:text-[#8845e4]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#8845e4]/10">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-bottom border-[#8845e4]/10 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-[#F8F9FA] px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-[#8845e4]/40" />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-[#8845e4]/30"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#8845e4]/60 hover:text-[#8845e4] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-[#8845e4]/10">
              <div className="text-right">
                <p className="text-sm font-bold text-[#8845e4]">Admin User</p>
                <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-[#B4D3D9] rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stitch" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
