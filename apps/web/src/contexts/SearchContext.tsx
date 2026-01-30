'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ServiceCategory } from '@ozar/shared';

interface SearchFilters {
  category?: ServiceCategory;
  location?: {
    city: string;
    area?: string;
    lat: number;
    lng: number;
  };
  radius?: number;
  minRating?: number;
  maxPrice?: number;
  availability?: string;
  sortBy?: 'rating' | 'price' | 'distance' | 'reviews';
}

interface SearchContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: (key: keyof SearchFilters, value: any) => void;
  clearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
