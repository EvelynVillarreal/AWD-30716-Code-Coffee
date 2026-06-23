'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function clearStoredAuth(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

function loadStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };

  const token = localStorage.getItem('auth_token');
  const userJson = localStorage.getItem('auth_user');

  if (!token || !userJson || isTokenExpired(token)) {
    clearStoredAuth();
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(userJson) as User, token };
  } catch {
    clearStoredAuth();
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = loadStoredAuth();
    setUser(stored.user);
    setToken(stored.token);
  }, []);

  function login(newUser: User, newToken: string): void {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
  }

  function logout(): void {
    clearStoredAuth();
    setUser(null);
    setToken(null);
    router.push('/');
  }

  const isLoggedIn = !!token && !!user;
  const isAdmin = isLoggedIn && user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
