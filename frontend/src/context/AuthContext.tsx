import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, HealthProfile, LoginRequest, RegisterRequest } from '../types';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  oauthLoginUser as apiOAuthLogin,
  getCurrentUser,
} from '../api/client';
import { authenticateWithGoogle, authenticateWithApple } from '../api/firebase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  healthProfile: HealthProfile;
  homeLocation: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  signInWithGoogle: (options?: { healthProfile?: HealthProfile; homeLocation?: string }) => Promise<void>;
  signInWithApple: (options?: { healthProfile?: HealthProfile; homeLocation?: string }) => Promise<void>;
  logout: () => void;
  setHealthProfile: (profile: HealthProfile) => void;
  setHomeLocation: (location: string) => void;
}

const TOKEN_KEY = 'airsense_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [healthProfile, setHealthProfileState] = useState<HealthProfile>('asthma');
  const [homeLocation, setHomeLocationState] = useState<string>('Pune');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize user from stored token on app load
  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          setUser(userData);
          setHealthProfileState(userData.health_profile);
          setHomeLocationState(userData.home_location);
        } catch (err) {
          console.warn('Invalid or expired token, logging out.');
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (credentials: LoginRequest) => {
    const res = await apiLogin(credentials);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    setHealthProfileState(res.user.health_profile);
    setHomeLocationState(res.user.home_location);
  };

  const register = async (data: RegisterRequest) => {
    const res = await apiRegister(data);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    setHealthProfileState(res.user.health_profile);
    setHomeLocationState(res.user.home_location);
  };

  const signInWithGoogle = async (options?: { healthProfile?: HealthProfile; homeLocation?: string }) => {
    const oauthRes = await authenticateWithGoogle();
    const res = await apiOAuthLogin({
      provider: 'google',
      email: oauthRes.email,
      id_token: oauthRes.idToken,
      health_profile: options?.healthProfile || healthProfile,
      home_location: options?.homeLocation || homeLocation,
    });
    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    setHealthProfileState(res.user.health_profile);
    setHomeLocationState(res.user.home_location);
  };

  const signInWithApple = async (options?: { healthProfile?: HealthProfile; homeLocation?: string }) => {
    const oauthRes = await authenticateWithApple();
    const res = await apiOAuthLogin({
      provider: 'apple',
      email: oauthRes.email,
      id_token: oauthRes.idToken,
      health_profile: options?.healthProfile || healthProfile,
      home_location: options?.homeLocation || homeLocation,
    });
    localStorage.setItem(TOKEN_KEY, res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    setHealthProfileState(res.user.health_profile);
    setHomeLocationState(res.user.home_location);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const setHealthProfile = (profile: HealthProfile) => {
    setHealthProfileState(profile);
    if (user) {
      setUser({ ...user, health_profile: profile });
    }
  };

  const setHomeLocation = (location: string) => {
    setHomeLocationState(location);
    if (user) {
      setUser({ ...user, home_location: location });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        healthProfile,
        homeLocation,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        signInWithGoogle,
        signInWithApple,
        logout,
        setHealthProfile,
        setHomeLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
