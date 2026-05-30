import React from 'react';
import { useFilters } from '../context/FilterContext';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

const SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const COLORS = [
  { name: 'Teal', hex: '#B4D3D9' },
  { name: 'Lavender', hex: '#BDA6CE' },
  { name: 'Lilac', hex: '#8845e4' },
  { name: 'Cream', hex: '#F2EAE0' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'White', hex: '#FFFFFF' },
];

export const FilterSidebar: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const { filters, setSize, setColor, setPriceRange, resetFilters } = useFilters();

  return (
    <aside className={`${isMobile ? 'w-full' : 'hidden lg:block w-64 sticky top-24 h-fit pr-8'} space-y-12`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-lilac">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-[10px] font-bold uppercase tracking-widest text-brand-lilac/40 hover:text-brand-lilac transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Size Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-lilac/40 mb-6">Size</h4>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => setSize(size)}
              className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                filters.size === size
                  ? 'bg-brand-lilac border-brand-lilac text-white shadow-lg'
                  : 'bg-white border-brand-lilac/10 text-brand-lilac hover:border-brand-lilac/30'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Swatches */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-lilac/40 mb-6">Color</h4>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => setColor(color.name)}
              title={color.name}
              className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                filters.color === color.name
                  ? 'border-brand-lilac scale-110 shadow-md'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
            >
              {filters.color === color.name && (
                <motion.div
                  layoutId="color-active"
                  className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-lilac/40 mb-6">Price Range</h4>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => setPriceRange([filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-brand-lilac"
          />
          <div className="flex justify-between text-[10px] font-bold text-brand-lilac">
            <span>$0</span>
            <span>Up to ${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.size || filters.color || filters.priceRange[1] < 500) && (
        <div className="pt-8 border-t border-brand-lilac/10">
          <div className="flex flex-wrap gap-2">
            {filters.size && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lilac/5 text-brand-lilac text-[10px] font-bold rounded-full">
                Size {filters.size}
                <X size={10} className="cursor-pointer" onClick={() => setSize(null)} />
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lilac/5 text-brand-lilac text-[10px] font-bold rounded-full">
                {filters.color}
                <X size={10} className="cursor-pointer" onClick={() => setColor(null)} />
              </span>
            )}
            {filters.priceRange[1] < 500 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-lilac/5 text-brand-lilac text-[10px] font-bold rounded-full">
                Under ${filters.priceRange[1]}
                <X size={10} className="cursor-pointer" onClick={() => setPriceRange([0, 500])} />
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
