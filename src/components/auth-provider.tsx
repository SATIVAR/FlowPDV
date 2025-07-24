'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/hooks/use-auth';
import type { User, Role } from '@/lib/types';
import { users, orders } from '@/lib/data';

const USER_STORAGE_KEY = 'tenantflow.user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserInStorage = (user: User | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const login = useCallback(async (email: string, password?: string): Promise<User> => {
    const foundUser = users.find(
      (u) => u.email === email && !u.isOAuth && u.password === password
    );
    if (foundUser) {
      updateUserInStorage(foundUser);
      return foundUser;
    }
    throw new Error('Invalid email or password');
  }, []);
  
  const googleLogin = useCallback(async (): Promise<User> => {
    const googleUser = users.find(u => u.isOAuth);
    if (googleUser) {
      updateUserInStorage(googleUser);
      return googleUser;
    }
    throw new Error('Google user not found in mock data.');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<User> => {
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: 'Cliente',
        avatar: 'https://placehold.co/100x100',
      };
      users.push(newUser);
      updateUserInStorage(newUser);
      return newUser;
    }, []);

  const logout = useCallback(() => {
    updateUserInStorage(null);
  }, []);

  const isAuthenticated = !!user;

  const hasRole = useCallback((role: Role | Role[]) => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.includes(user.role);
  }, [user]);

  const value = {
    user,
    login,
    googleLogin,
    logout,
    register,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
