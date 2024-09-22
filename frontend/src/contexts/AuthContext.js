import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { logout as logoutUtil, refreshToken } from '../utils/tokenUtils';
import Spinner from '../components/Common/Spinner';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('User not authenticated');
        return null;
      }
      console.error('Failed to fetch user:', error);
      return null;
    }
  }, []);

  const login = async (email, password) => {
    try {
      await apiClient.post('/users/login', { email, password });
      const userProfile = await loadUser();
      setUser(userProfile);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUtil(); // Call the logout utility function
      setUser(null); // Clear user session from the context
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userProfile = await loadUser();
        setUser(userProfile);
      } catch (error) {
        console.error('Error during user initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [loadUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, handleLogout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };