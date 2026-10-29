import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { useStore } from './StoreContext';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: Role) => void;
  logout: () => void;
  canManageUsers: boolean;
  canManageCatalogue: boolean;
  canViewSystemLogs: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { users, addLog } = useStore();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ortance_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ortance_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ortance_auth_user');
    }
  }, [currentUser]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Normalization
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'Identifiants invalides. Vérifiez votre adresse email.' };
    }

    // Passwords accepted for demo: 'responsable123', 'admin123', or any password if test
    if (pass.length < 4) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 4 caractères.' };
    }

    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);
    addLog('Connexion réussie', 'auth', `Connexion de l'utilisateur ${user.name} (${user.role})`);
    return { success: true };
  };

  const loginAsDemo = (targetRole: Role) => {
    const matched = users.find(u => u.role === targetRole) || users[0];
    if (matched) {
      setCurrentUser(matched);
      addLog('Connexion démo', 'auth', `Connexion rapide en tant que ${matched.role} (${matched.name})`);
    }
  };

  const logout = () => {
    if (currentUser) {
      addLog('Déconnexion', 'auth', `Déconnexion de ${currentUser.name}`);
    }
    setCurrentUser(null);
    localStorage.removeItem('ortance_auth_user');
  };

  const role = currentUser?.role || null;
  const isAuthenticated = !!currentUser;
  const canManageUsers = role === 'INFORMATICIEN';
  const canManageCatalogue = role === 'RESPONSABLE' || role === 'INFORMATICIEN';
  const canViewSystemLogs = role === 'INFORMATICIEN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role,
        login,
        loginAsDemo,
        logout,
        canManageUsers,
        canManageCatalogue,
        canViewSystemLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
