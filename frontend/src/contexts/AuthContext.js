import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure this is correctly imported

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = jwtDecode(token); // Decode JWT using jwtDecode
    console.log('Decoded Token Payload:', payload); // Log the decoded token
    return payload.exp < Date.now() / 1000; // Check expiry timestamp
  };

  // Refresh token function
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Stored Refresh Token:', refreshToken); // Log the refresh token

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/refresh', { refreshToken });
      console.log('New Access Token after Refresh:', response.data.token); // Log the new access token
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
      console.log('Stored Token:', token); // Log the stored token

      // Check if the token is expired and refresh if necessary
      if (token && isTokenExpired(token)) {
        try {
          console.log('Token expired. Attempting to refresh...');
          token = await refreshToken();
        } catch (error) {
          console.error('Failed to refresh token', error);
          return; // Exit if the refresh fails
        }
      }

      if (token && !user) {
        console.log('Fetching user profile with token...');
        axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          console.log('User profile fetched:', response.data); // Log the fetched user profile
          setUser(response.data); // Set user data
        })
        .catch(error => console.error('Failed to fetch user', error));
      }
    };

    loadUser();
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      console.log('Login Response:', response.data); // Log the login response
      
      localStorage.setItem('token', response.data.accessToken); // Save access token
      localStorage.setItem('refreshToken', response.data.refreshToken); // Save refresh token
      
      // Check if the token is a valid string before decoding
      const accessToken = response.data.accessToken;
      if (typeof accessToken === 'string') {
        const decodedToken = jwtDecode(accessToken); // Decode token
        console.log('Decoded Token at Login:', decodedToken); // Log the decoded token
        setUser({ ...response.data.user, role: decodedToken.role }); // Ensure role is in user data
      } else {
        console.error('Access token is not a string:', accessToken);
      }
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  const logout = () => {
    console.log('Logging out...'); // Log the logout action
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
