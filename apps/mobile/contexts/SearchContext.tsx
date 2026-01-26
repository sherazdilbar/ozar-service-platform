import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@ozar_search_history';
const MAX_HISTORY_ITEMS = 10;

interface SearchContextType {
  searchHistory: string[];
  addToHistory: (query: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const addToHistory = async (query: string) => {
    if (!query.trim()) return;

    try {
      const trimmedQuery = query.trim().toLowerCase();
      
      // Remove if already exists
      const filtered = searchHistory.filter(item => item !== trimmedQuery);
      
      // Add to beginning
      const newHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const removeFromHistory = async (query: string) => {
    try {
      const newHistory = searchHistory.filter(item => item !== query);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchHistory,
        addToHistory,
        clearHistory,
        removeFromHistory,
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
