import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { UserProfile, UserRole } from '../backend';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, clear: clearIdentity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!actor || !identity) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem('attendease_user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          const profile = await actor.getCallerUserProfile();
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem('attendease_user', JSON.stringify(profile));
          }
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [actor, identity]);

  const login = (phoneNumber: string, role: UserRole) => {
    const user: UserProfile = {
      phoneNumber,
      role,
      name: '',
    };
    setCurrentUser(user);
    localStorage.setItem('attendease_user', JSON.stringify(user));
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('attendease_user');
    queryClient.clear();
    await clearIdentity();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser && !!identity,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
