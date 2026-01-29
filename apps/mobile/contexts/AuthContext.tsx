import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, clearTokens } from '@ozar/shared/apiClient';
import { User } from '@ozar/shared/types';

// Use dynamic import for AsyncStorage to handle web/native differences
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // Fallback for web or if AsyncStorage is not available
  AsyncStorage = {
    getItem: async (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: async (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'CUSTOMER' | 'PRO';
  location?: {
    city: string;
    area: string;
    lat: number;
    lng: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      console.log('[AuthContext] Loading user from storage...');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userData = await AsyncStorage.getItem('user');
      
      console.log('[AuthContext] Token found:', !!accessToken);
      console.log('[AuthContext] User data found:', !!userData);
      
      if (accessToken && userData) {
        // Set tokens in the API client
        const { setTokens } = require('@ozar/shared/apiClient');
        setTokens(accessToken, refreshToken || '');
        
        const parsedUser = JSON.parse(userData);
        console.log('[AuthContext] User restored:', parsedUser.email, parsedUser.role);
        setUser(parsedUser);
      } else {
        console.log('[AuthContext] No stored session found');
      }
    } catch (error) {
      console.error('[AuthContext] Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Logging in...');
      const result = await authApi.login(email, password);
      
      console.log('[AuthContext] Login successful, storing tokens...');
      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', result.accessToken);
      await AsyncStorage.setItem('refreshToken', result.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      
      // Explicitly set tokens in API client (authApi.login already does this, but being explicit)
      const { setTokens } = require('@ozar/shared/apiClient');
      setTokens(result.accessToken, result.refreshToken);
      
      console.log('[AuthContext] Tokens stored, user:', result.user.email);
      setUser(result.user);
    } catch (error: any) {
      console.error('[AuthContext] Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await authApi.register(data);
      
      // Store tokens in AsyncStorage
      await AsyncStorage.setItem('accessToken', result.accessToken);
      await AsyncStorage.setItem('refreshToken', result.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      
      // Explicitly set tokens in API client (authApi.register already does this, but being explicit)
      const { setTokens } = require('@ozar/shared/apiClient');
      setTokens(result.accessToken, result.refreshToken);
      
      setUser(result.user);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    console.log('Logout function called');
    
    // Clear tokens from shared API client
    console.log('Clearing tokens from API client');
    clearTokens();
    
    // Clear AsyncStorage
    console.log('Clearing AsyncStorage');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
    
    // Set user to null (this will trigger redirect in _layout.tsx)
    console.log('Setting user to null');
    setUser(null);
    
    console.log('Logout complete, user should be null now');
    
    // Try to call backend logout (but don't wait for it)
    authApi.logout().catch((e) => console.log('Backend logout error (ignored):', e));
  };

  const refreshUser = async () => {
    try {
      console.log('[AuthContext] Refreshing user data...');
      const result = await authApi.getProfile();
      console.log('[AuthContext] User refreshed:', result);
      setUser(result);
      await AsyncStorage.setItem('user', JSON.stringify(result));
    } catch (error: any) {
      console.error('[AuthContext] Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
