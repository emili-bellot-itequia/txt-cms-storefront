import React, { createContext, useContext, useState } from 'react';
import type { AuthResponse } from '../types';

interface AuthState {
  token: string | null;
  customerId: number | null;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('storefront_token');
    const user = localStorage.getItem('storefront_user');
    if (token && user) {
      const u = JSON.parse(user);
      return { token, customerId: u.customerId, name: u.name, email: u.email, isAuthenticated: true };
    }
    return { token: null, customerId: null, name: '', email: '', isAuthenticated: false };
  });

  const login = (data: AuthResponse) => {
    localStorage.setItem('storefront_token', data.token);
    localStorage.setItem('storefront_user', JSON.stringify({ customerId: data.customerId, name: data.name, email: data.email }));
    setState({ token: data.token, customerId: data.customerId, name: data.name, email: data.email, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('storefront_token');
    localStorage.removeItem('storefront_user');
    setState({ token: null, customerId: null, name: '', email: '', isAuthenticated: false });
  };

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
