'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  dealership_name: string;
  phone_number: string;
  location?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  dealership_name: string;
  phone_number: string;
  location?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser() as unknown as AuthResponse;
      setUser(response.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password }) as unknown as AuthResponse;
      setUser(response.user);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data) as unknown as AuthResponse;
      setUser(response.user);
      toast.success('Registration successful! Welcome to CarStrel.');
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Logout failed';
      toast.error(errorMessage);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser() as unknown as AuthResponse;
      setUser(response.user);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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