import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants/navigation';

export const Footer = () => {
  return (
    <footer className="bg-brand-teal text-brand-ink py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-4xl font-display font-black tracking-tighter mb-6 text-brand-lilac">STITCH</h2>
          <p className="text-brand-ink/70 max-w-sm mb-8 font-medium">
            Crafting the future of footwear with a nod to the past. Join our journey towards sustainable innovation.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="p-3 bg-brand-lilac/10 hover:bg-brand-lilac/20 rounded-2xl transition-colors text-brand-lilac">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase mb-6 text-brand-lilac">Quick Links</h3>
          <ul className="space-y-4">
            {NAV_LINKS.map(item => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `text-sm font-bold transition-colors hover:text-brand-lilac ${isActive ? 'text-brand-lilac underline underline-offset-4' : 'text-brand-ink/60'}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase mb-6 text-brand-lilac">Newsletter</h3>
          <p className="text-sm text-brand-ink/70 mb-4 font-medium">Get early access to drops and exclusive offers.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="w-full bg-white/40 border border-brand-lilac/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-lilac/40 placeholder:text-brand-ink/30"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-lilac text-white rounded-xl hover:bg-brand-lavender transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="mt-8">
            <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-4">Secure Payment</p>
            <div className="flex gap-3">
              {['bKash', 'Nagad', 'Rocket'].map(mfs => (
                <div key={mfs} className="px-3 py-1.5 bg-white/40 rounded-lg text-[10px] font-black text-brand-ink border border-brand-ink/5">
                  {mfs}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-brand-lilac/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-bold text-brand-ink/40">
        <p>© 2026 STITCH FOOTWEAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-brand-lilac transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-brand-lilac transition-colors">TERMS OF SERVICE</a>
        </div>
      </div>
    </footer>
  );
};
