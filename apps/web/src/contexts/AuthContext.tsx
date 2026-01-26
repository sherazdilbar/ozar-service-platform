'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAccessToken } from '@ozar/shared/apiClient';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'CUSTOMER' | 'PRO' | 'ADMIN';
  avatar?: string;
  location?: {
    city: string;
    area?: string;
    lat?: number;
    lng?: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getAccessToken();
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    setUser(result.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(result.user));
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Force reload to clear all state
        window.location.href = '/';
      }
    }
  };

  const register = async (data: any) => {
    const result = await authApi.register(data);
    setUser(result.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(result.user));
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, register, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
