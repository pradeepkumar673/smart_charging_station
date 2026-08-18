import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Helper to persist auth state
  const saveAuth = (userObj, tokenStr) => {
    setUser(userObj);
    setToken(tokenStr);
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', tokenStr);
  };

  // Helper to clear auth state
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Fetch current authenticated user
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const userData = response.data?.data?.user;
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login (Driver or Owner)
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userObj, token: tokenStr } = response.data.data;
    saveAuth(userObj, tokenStr);
    return userObj;
  };

  // Register EV Driver
  const registerDriver = async (driverData) => {
    const response = await api.post('/auth/register/driver', driverData);
    const { user: userObj, token: tokenStr } = response.data.data;
    saveAuth(userObj, tokenStr);
    return userObj;
  };

  // Register Station Owner
  const registerOwner = async (ownerData) => {
    const response = await api.post('/auth/register/owner', ownerData);
    const { user: userObj, token: tokenStr } = response.data.data;
    saveAuth(userObj, tokenStr);
    return userObj;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  };

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  };

  // Reset Password
  const resetPassword = async (email, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    return response.data;
  };

  // Logout
  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    login,
    registerDriver,
    registerOwner,
    forgotPassword,
    verifyOtp,
    resetPassword,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
