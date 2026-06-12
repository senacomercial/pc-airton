'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  sub: string;
  email: string;
  firstName: string;
  userType: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore token from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sd_token') : null;
    if (stored) {
      setToken(stored);
      // Could decode JWT here to set user, but keeping it simple for now
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    // Modo demo (GitHub Pages estático, sem backend): aceita as credenciais
    // de demonstração localmente para liberar a navegação.
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (demoMode) {
      const demoToken = 'demo-token';
      setToken(demoToken);
      localStorage.setItem('sd_token', demoToken);
      setUser({ sub: 'demo', email, firstName: 'João', userType: 'SUGAR_DADDY' });
      return;
    }

    const res = await fetch('/backend/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    const newToken = data.access_token || data.accessToken;
    setToken(newToken);
    localStorage.setItem('sd_token', newToken);
    // Optionally decode JWT to extract user info
    if (data.user) setUser(data.user);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sd_token');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
