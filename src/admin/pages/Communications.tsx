import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  Clock, 
  FileText, 
  Plus, 
  ChevronRight,
  Layout,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

const templates = [
  { id: 'T1', name: 'Order Confirmation', subject: 'Your Stitch order {{order_id}} is confirmed!', type: 'Transactional' },
  { id: 'T2', name: 'Order Shipped', subject: 'Great news! Your order {{order_id}} is on its way', type: 'Transactional' },
  { id: 'T3', name: 'Abandoned Cart', subject: 'Did you forget something, {{customer_name}}?', type: 'Marketing' },
  { id: 'T4', name: 'New Drop Alert', subject: 'The Pastel Collection is here!', type: 'Marketing' },
];

export const Communications = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'compose' | 'triggers'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customEmail, setCustomEmail] = useState({
    to: '',
    subject: '',
    body: ''
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Communications</h1>
          <p className="text-[#8845e4]/60 font-medium">Manage email templates and automated triggers.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#8845e4]/10">
        {[
          { id: 'templates', label: 'Template Library', icon: Layout },
          { id: 'compose', label: 'Manual Compose', icon: Send },
          { id: 'triggers', label: 'Event Triggers', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all relative ${
              activeTab === tab.id ? 'text-[#8845e4]' : 'text-[#8845e4]/40 hover:text-[#8845e4]/60'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8845e4] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left p-6 rounded-[2rem] border transition-all ${
                  selectedTemplate.id === t.id 
                    ? 'bg-white border-[#8845e4] shadow-lg shadow-[#8845e4]/10' 
                    : 'bg-white border-[#8845e4]/5 hover:border-[#8845e4]/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    t.type === 'Transactional' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {t.type}
                  </span>
                  <FileText size={16} className="text-[#8845e4]/20" />
                </div>
                <h3 className="font-bold text-[#8845e4] mb-1">{t.name}</h3>
                <p className="text-[10px] font-medium text-[#8845e4]/40 truncate">{t.subject}</p>
              </button>
            ))}
            <button className="w-full p-6 rounded-[2rem] border border-dashed border-[#8845e4]/20 text-[#8845e4]/40 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#8845e4]/5 transition-all">
              <Plus size={18} />
              Create New Template
            </button>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-[#8845e4]/5 shadow-sm p-8 flex flex-col min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight">Template Editor</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#F8F9FA] rounded-xl text-xs font-bold text-[#8845e4] hover:bg-[#8845e4]/5 transition-all">Preview</button>
                <button className="px-6 py-2 bg-[#8845e4] text-white rounded-xl text-xs font-bold hover:bg-[#8845e4]/90 transition-all">Save Changes</button>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Subject Line</label>
                <input 
                  type="text" 
                  value={selectedTemplate.subject}
                  className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Email Body (HTML/Text)</label>
                <div className="flex-1 bg-[#F8F9FA] border border-[#8845e4]/10 rounded-[2rem] p-8 font-mono text-sm text-[#8845e4]/80 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="w-32 h-12 bg-[#8845e4] rounded-lg flex items-center justify-center text-white font-black italic mb-8">STITCH</div>
                    <p className="font-sans font-bold text-lg text-[#8845e4]">Hello {"{{customer_name}}"},</p>
                    <p className="font-sans">Your order {"{{order_id}}"} has been updated.</p>
                    <div className="py-8 border-y border-[#8845e4]/10 font-sans space-y-2">
                      <p className="text-xs font-black text-[#8845e4]/40 uppercase tracking-widest">Order Details</p>
                      <p className="font-bold text-[#8845e4]">Items: Cloud Walker Pro x 1</p>
                      <p className="font-bold text-[#8845e4]">Total: $120.00</p>
                    </div>
                    <button className="bg-[#8845e4] text-white px-8 py-4 rounded-2xl font-bold text-sm mt-8">
                      View Order Status
                    </button>
                    <p className="pt-12 text-[10px] font-bold text-[#8845e4]/40 uppercase tracking-widest">© 2026 STITCH FOOTWEAR</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {['{{customer_name}}', '{{order_id}}', '{{tracking_link}}', '{{total_amount}}'].map(tag => (
                  <button key={tag} className="px-3 py-1.5 bg-[#8845e4]/5 rounded-lg text-[10px] font-black text-[#8845e4] hover:bg-[#8845e4]/10 transition-all">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="bg-white rounded-[3rem] border border-[#8845e4]/5 shadow-sm p-8 max-w-4xl mx-auto w-full">
          <h3 className="text-xl font-display font-black text-[#8845e4] uppercase tracking-tight mb-8">Compose Custom Email</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">To (Customer Email or Segment)</label>
                <div className="relative">
                  <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8845e4]/40" />
                  <input 
                    type="text" 
                    placeholder="e.g. all 'Men Collection' buyers"
                    className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-12 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Subject</label>
                <input 
                  type="text" 
                  placeholder="Email subject..."
                  className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 px-6 py-4 rounded-2xl outline-none focus:border-[#8845e4] transition-all font-bold text-[#8845e4]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest block">Message Body</label>
              <textarea 
                placeholder="Write your message here..."
                className="w-full bg-[#F8F9FA] border border-[#8845e4]/10 rounded-[2rem] p-8 text-sm font-medium outline-none focus:border-[#8845e4] transition-all min-h-[300px]"
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-[#8845e4] text-white px-12 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#8845e4]/90 transition-all shadow-lg shadow-[#8845e4]/20">
                <Send size={18} />
                Send Email Now
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'triggers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Order Shipped', trigger: 'Status changes to Shipped', action: 'Send "Order Shipped" template', icon: Zap, active: true },
            { title: 'New Registration', trigger: 'User creates account', action: 'Send "Welcome" template', icon: Users, active: true },
            { title: 'Abandoned Cart', trigger: 'Cart inactive for 24h', action: 'Send "Abandoned Cart" template', icon: Clock, active: false },
            { title: 'Order Delivered', trigger: 'Status changes to Delivered', action: 'Send "Feedback Request" template', icon: CheckCircle2, active: true },
          ].map((trigger, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-[#8845e4]/5 shadow-sm flex items-start gap-6">
              <div className={`p-4 rounded-2xl ${trigger.active ? 'bg-[#8845e4]/10 text-[#8845e4]' : 'bg-gray-100 text-gray-400'}`}>
                <trigger.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-[#8845e4]">{trigger.title}</h3>
                  <button className={`w-10 h-5 rounded-full relative transition-all ${trigger.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${trigger.active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-[#8845e4] rounded-full" />
                    Trigger: {trigger.trigger}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8845e4]/40 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-[#8845e4] rounded-full" />
                    Action: {trigger.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
