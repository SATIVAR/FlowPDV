import { useContext, createContext } from 'react';
import type { User, Role } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<User>;
  googleLogin: () => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;
  isAuthenticated: boolean;
  hasRole: (role: Role | Role[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
