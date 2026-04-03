import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API } from '@/config/api';

interface User {
  name: string;
  phone: string;
  state: string;
  district: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  name: "Ravi Kumar",
  phone: "9999999999",
  state: "Karnataka",
  district: "Mysuru",
  token: "demo-token-123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('agripredict_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsDemoMode(parsed.token === 'demo-token-123');
      } catch {
        localStorage.removeItem('agripredict_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((data: User) => {
    setUser(data);
    setIsDemoMode(data.token === 'demo-token-123');
    localStorage.setItem('agripredict_user', JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('agripredict_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, isDemoMode, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { MOCK_USER };
export type { User };
