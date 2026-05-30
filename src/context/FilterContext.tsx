import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface FilterState {
  category: string;
  size: number | null;
  priceRange: [number, number];
  sortOrder: string;
  color: string | null;
}

interface FilterContextType {
  filters: FilterState;
  setCategory: (category: string) => void;
  setSize: (size: number | null) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortOrder: (order: string) => void;
  setColor: (color: string | null) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  size: null,
  priceRange: [0, 500],
  sortOrder: 'Featured',
  color: null,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>(() => {
    const category = searchParams.get('category') || defaultFilters.category;
    const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : defaultFilters.size;
    const sortOrder = searchParams.get('sort') || defaultFilters.sortOrder;
    const color = searchParams.get('color') || defaultFilters.color;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : defaultFilters.priceRange[0];
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : defaultFilters.priceRange[1];

    return {
      category,
      size,
      sortOrder,
      color,
      priceRange: [minPrice, maxPrice],
    };
  });

  useEffect(() => {
    const params: any = {};
    if (filters.category !== 'All') params.category = filters.category;
    if (filters.size) params.size = filters.size.toString();
    if (filters.sortOrder !== 'Featured') params.sort = filters.sortOrder;
    if (filters.color) params.color = filters.color;
    if (filters.priceRange[0] !== 0) params.minPrice = filters.priceRange[0].toString();
    if (filters.priceRange[1] !== 500) params.maxPrice = filters.priceRange[1].toString();
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const setCategory = (category: string) => setFilters(prev => ({ ...prev, category }));
  const setSize = (size: number | null) => setFilters(prev => ({ ...prev, size: prev.size === size ? null : size }));
  const setPriceRange = (priceRange: [number, number]) => setFilters(prev => ({ ...prev, priceRange }));
  const setSortOrder = (sortOrder: string) => setFilters(prev => ({ ...prev, sortOrder }));
  const setColor = (color: string | null) => setFilters(prev => ({ ...prev, color: prev.color === color ? null : color }));
  const resetFilters = () => setFilters(defaultFilters);

  return (
    <FilterContext.Provider value={{ filters, setCategory, setSize, setPriceRange, setSortOrder, setColor, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
