'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { getToken, setToken, clearToken } from '@/utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authService.me(token);
          if (response.success && response.user) {
            // Merge profile data into user object for easy access
            const userWithProfile = {
              ...response.user,
              full_name: response.profile?.full_name || response.user.full_name,
              profile: response.profile
            };
            setUser(userWithProfile);
          } else {
            clearToken();
          }
        } catch (err) {
          console.error('Failed to load user:', err);
          clearToken();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        // Merge profile data into user object for easy access
        const userWithProfile = {
          ...response.user,
          full_name: response.profile?.full_name || response.user.full_name,
          profile: response.profile
        };
        setUser(userWithProfile);
        return { success: true };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (full_name, email, password) => {
    try {
      setError(null);
      const response = await authService.register({ full_name, email, password });
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        // Merge profile data into user object for easy access
        const userWithProfile = {
          ...response.user,
          full_name: response.profile?.full_name || response.user.full_name,
          profile: response.profile
        };
        setUser(userWithProfile);
        return { success: true };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setError(null);
  };

  const refreshUser = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await authService.me(token);
        if (response.success && response.user) {
          const userWithProfile = {
            ...response.user,
            full_name: response.profile?.full_name || response.user.full_name,
            profile: response.profile
          };
          setUser(userWithProfile);
        }
      } catch (err) {
        console.error('Failed to refresh user:', err);
      }
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}