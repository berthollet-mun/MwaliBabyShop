import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Role, User } from '../types';
import { api, ApiError } from '../lib/api';
import { useStore } from './StoreContext';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  canManageUsers: boolean;
  canManageCatalogue: boolean;
  canViewSystemLogs: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refreshAdminData } = useStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const result = await api.get<{ user: User }>('/auth/me');
        if (!active) return;
        setCurrentUser(result.user);
        await refreshAdminData();
      } catch {
        if (active) setCurrentUser(null);
      } finally {
        if (active) setIsCheckingSession(false);
      }
    };
    void restoreSession();
    return () => { active = false; };
  }, [refreshAdminData]);

  const login = async (email: string, password: string) => {
    try {
      const result = await api.post<{ user: User }>('/auth/login', { email: email.trim(), password });
      setCurrentUser(result.user);
      await refreshAdminData();
      return { success: true };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Connexion impossible. Vérifiez le serveur et réessayez.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setCurrentUser(null);
    }
  };

  const role = currentUser?.role || null;
  const isAuthenticated = Boolean(currentUser);
  const canManageUsers = role === 'ADMIN';
  const canManageCatalogue = role === 'ADMIN' || role === 'RESPONSABLE';
  const canViewSystemLogs = role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isCheckingSession,
      role,
      login,
      logout,
      canManageUsers,
      canManageCatalogue,
      canViewSystemLogs,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
