
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/hooks/use-auth';
import type { User, Role } from '@/lib/types';
import { users } from '@/lib/data';

const USER_STORAGE_KEY = 'flowpdv.user';

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

  const login = useCallback(async (whatsapp: string, password?: string): Promise<User> => {
    const foundUser = users.find(
      (u) => u.whatsapp === whatsapp && u.password === password
    );
    if (foundUser) {
      updateUserInStorage(foundUser);
      return foundUser;
    }
    throw new Error('WhatsApp ou senha inválidos');
  }, []);
  
  const register = useCallback(async (name: string, whatsapp: string, password: string): Promise<User> => {
      const existingUser = users.find((u) => u.whatsapp === whatsapp);
      if (existingUser) {
        throw new Error('Usuário com este WhatsApp já existe');
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        whatsapp,
        password,
        role: 'Lojista',
        avatar: 'https://placehold.co/100x100',
      };
      users.push(newUser); // Note: In a real app, this would be a DB call.
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
