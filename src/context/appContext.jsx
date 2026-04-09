// Context hook for managing app state
import React, { createContext, useState, useContext, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [analysis, setAnalysis] = useState(null);

  const login = useCallback((user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const value = {
    user,
    token,
    setUser,
    setToken,
    login,
    logout,
    loading,
    setLoading,
    error,
    setError,
    selectedStock,
    setSelectedStock,
    analysis,
    setAnalysis,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
