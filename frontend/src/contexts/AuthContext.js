import React, { createContext,useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { logout as logoutUtil, refreshToken } from '../utils/tokenUtils';
import Spinner from '../components/Common/Spinner';



const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const updateUser = (newUserData) => {
    setUser(newUserData); // Update user data
  };

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
      const response = await apiClient.post('/users/login', { email, password });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const userProfile = await loadUser();
      setUser(userProfile);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUtil(); // Call logout utility to handle API logout
      setUser(null);
      setAccessToken(null);
      delete apiClient.defaults.headers.common['Authorization']; // Clear axios auth header
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/login'; // Redirect to login after logout
    }
  };

  const refreshAccessToken = async () => {
    try {
      const newToken = await refreshToken();
      setAccessToken(newToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
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
    <AuthContext.Provider value={{ user,updateUser, login, handleLogout, refreshAccessToken, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
