import React from 'react';
import { 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  Users,
  Save
} from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Settings</h1>
        <p className="text-[#8845e4]/60 font-medium">Configure your Stitch platform and team permissions.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* RBAC Section */}
        <section className="bg-white p-8 rounded-[3rem] border border-[#8845e4]/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Team & Permissions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Admin User', role: 'Super Admin', email: 'admin@stitch.com' },
              { name: 'Tanvir Ahmed', role: 'Inventory Manager', email: 'tanvir@stitch.com' },
              { name: 'Nesha Isnan', role: 'Customer Support', email: 'nesha@stitch.com' },
            ].map((user) => (
              <div key={user.email} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-transparent hover:border-[#8845e4]/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#B4D3D9] rounded-full flex items-center justify-center text-[#8845e4] font-bold">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[#8845e4] text-sm">{user.name}</p>
                    <p className="text-xs text-[#8845e4]/40 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-[#8845e4]/60 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#8845e4]/10">
                    {user.role}
                  </span>
                  <button className="text-xs font-bold text-[#8845e4] hover:underline">Edit</button>
                </div>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-[#8845e4]/20 rounded-2xl text-xs font-black text-[#8845e4]/40 uppercase tracking-widest hover:border-[#8845e4]/40 hover:text-[#8845e4]/60 transition-all">
              + Add Team Member
            </button>
          </div>
        </section>

        {/* Marketing Section */}
        <section className="bg-white p-8 rounded-[3rem] border border-[#8845e4]/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Marketing & Notifications</h2>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Email Campaigns', desc: 'Send automated product updates and newsletters.', enabled: true },
              { label: 'SMS Alerts', desc: 'Notify customers about order status via SMS.', enabled: false },
              { label: 'Push Notifications', desc: 'Engage users with real-time app notifications.', enabled: true },
              { label: 'Abandoned Cart Recovery', desc: 'Automatically email users who leave items in their bag.', enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="max-w-md">
                  <p className="font-bold text-[#8845e4] text-sm">{item.label}</p>
                  <p className="text-xs text-[#8845e4]/40 font-medium">{item.desc}</p>
                </div>
                <button className={`w-12 h-6 rounded-full transition-all relative ${item.enabled ? 'bg-[#8845e4]' : 'bg-[#F2EAE0]'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'right-1' : 'left-1 shadow-sm'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button className="px-8 py-4 bg-[#F2EAE0] text-[#8845e4] rounded-2xl font-bold text-sm hover:bg-[#BDA6CE]/20 transition-all">
            Discard Changes
          </button>
          <button className="px-8 py-4 bg-[#8845e4] text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
