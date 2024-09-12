import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    return payload.exp < Date.now() / 1000; // Check expiry timestamp
  };

  // Refresh token function
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/refresh', { refreshToken });
      localStorage.setItem('token', response.data.token); // Update the access token
      return response.data.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw new Error('Token refresh failed');
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      let token = localStorage.getItem('token');
      
      // Check if the token is expired and refresh if necessary
      if (isTokenExpired(token)) {
        try {
          token = await refreshToken();
        } catch (error) {
          console.error('Failed to refresh token', error);
          return; // Exit if the refresh fails
        }
      }

      if (token && !user) {
        axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setUser(response.data))
        .catch(error => console.error('Failed to fetch user', error));
      }
    };

    loadUser();
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token); // Access token
      localStorage.setItem('refreshToken', response.data.refreshToken); // Refresh token
      setUser(response.data.user); // Make sure the response contains user data
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
