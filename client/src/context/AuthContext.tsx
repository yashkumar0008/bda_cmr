import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('bda_token');
    const storedUser = localStorage.getItem('bda_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('bda_token', t);
    localStorage.setItem('bda_user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bda_token');
    localStorage.removeItem('bda_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('bda_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
