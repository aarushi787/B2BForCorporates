import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      // try to fetch current user
      apiClient.get('/auth/me')
        .then((u: any) => setUser(u))
        .catch(() => apiClient.clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userOverride?: User) => {
    apiClient.setToken(token);
    if (userOverride) setUser(userOverride);
    else apiClient.get('/auth/me').then((u: any) => setUser(u)).catch(() => setUser(null));
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const u = await apiClient.get('/auth/me');
      setUser(u as User);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
