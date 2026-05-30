import React from 'react';
import { 
  Palette, 
  Type, 
  Box, 
  Layers,
  CheckCircle2
} from 'lucide-react';

const colors = [
  { name: 'Deep Lilac', hex: '#8845e4', usage: 'Primary Brand Color, Actions' },
  { name: 'Soft Teal', hex: '#B4D3D9', usage: 'Secondary Accent, Containers' },
  { name: 'Lavender', hex: '#BDA6CE', usage: 'Tertiary Accent, Hover States' },
  { name: 'Cream', hex: '#F2EAE0', usage: 'Background, Neutral Surface' },
  { name: 'Ink', hex: '#1A1A1A', usage: 'Primary Typography' },
  { name: 'Ghost', hex: '#F8F9FA', usage: 'Admin Background, Subtle UI' },
];

export const DesignSystem = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-display font-black text-[#8845e4] uppercase tracking-tight">Design System</h1>
        <p className="text-[#8845e4]/60 font-medium">The visual foundation of the Stitch brand.</p>
      </div>

      {/* Color Palette */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Palette size={20} className="text-[#8845e4]" />
          <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Color Palette</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colors.map((color) => (
            <div key={color.hex} className="bg-white p-6 rounded-[2.5rem] border border-[#8845e4]/5 shadow-sm flex items-center gap-6">
              <div 
                className="w-20 h-20 rounded-3xl shadow-inner border border-[#8845e4]/10"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="font-bold text-[#8845e4] text-sm">{color.name}</p>
                <p className="text-xs font-mono font-black text-[#8845e4]/40 uppercase tracking-widest">{color.hex}</p>
                <p className="text-[10px] text-[#8845e4]/60 font-medium mt-2 leading-tight">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Type size={20} className="text-[#8845e4]" />
          <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">Typography</h2>
        </div>
        <div className="bg-white p-12 rounded-[3rem] border border-[#8845e4]/5 shadow-sm space-y-12">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Display Font: Space Grotesk</p>
            <h1 className="text-7xl font-display font-black text-[#8845e4] tracking-tighter leading-none">STITCH / BOLD</h1>
            <p className="text-sm text-[#8845e4]/60 max-w-2xl font-medium leading-relaxed">
              Used for massive headlines, hero sections, and brand-heavy elements.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Body Font: Inter</p>
            <p className="text-2xl font-bold text-[#8845e4]">The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-[#8845e4]/60 max-w-2xl font-medium leading-relaxed">
              Used for all UI elements, body copy, and technical information.
            </p>
          </div>
        </div>
      </section>

      {/* UI Components */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Box size={20} className="text-[#8845e4]" />
          <h2 className="text-xl font-bold text-[#8845e4] uppercase tracking-tight">UI Components</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-[#8845e4]/5 shadow-sm space-y-8">
            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Buttons</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#8845e4] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-[#8845e4]/20">Primary Action</button>
              <button className="bg-[#B4D3D9] text-[#8845e4] px-8 py-4 rounded-2xl font-bold text-sm">Secondary Action</button>
              <button className="border-2 border-[#8845e4] text-[#8845e4] px-8 py-4 rounded-2xl font-bold text-sm">Ghost Action</button>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-[#8845e4]/5 shadow-sm space-y-8">
            <p className="text-[10px] font-black text-[#8845e4]/40 uppercase tracking-widest">Status Badges</p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                Delivered
              </span>
              <span className="px-4 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={12} />
                Processing
              </span>
              <span className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Palette size={12} />
                Cancelled
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
