// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { logout as logoutUtil } from '../utils/tokenUtils';
import Spinner from '../components/Common/Spinner';
import {
  getStoredAccessToken,
  setStoredAccessToken,
  refreshToken,
  logout,
  setApiClientToken,
} from "../utils/tokenUtils";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(getStoredAccessToken());

  /**
   * Update User Profile
   * @param {Object} newUserData - The updated user data (e.g., username, email)
   * @returns {Object} - The updated user object
   */
  const updateUser = async (newUserData) => {
    try {
      const response = await apiClient.put('/users/profile', newUserData); // Ensure this is the correct API route
      const updatedUser = response.data.user;

      // Update the local user state with the updated user info from the server
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error.response || error);
      throw new Error('Failed to update user profile');
    }
  };

  /**
   * Update User Preferences
   * @param {Object} preferences - The preferences to update (e.g., notificationsEnabled)
   * @returns {Object} - The updated user object
   */
  const updateUserPreferences = async (preferences) => {
    try {
      const response = await apiClient.put('/users/preferences', preferences); // Ensure this is the correct API route
      const updatedPreferences = response.data.preferences;

      // Update the user state with the new preferences
      setUser((prevUser) => ({
        ...prevUser,
        preferences: {
          ...prevUser.preferences,
          ...updatedPreferences,
        },
      }));

      return updatedPreferences;
    } catch (error) {
      console.error('Error updating preferences:', error.response || error);
      throw new Error('Failed to update user preferences');
    }
  };

  /**
   * Update User Password
   * @param {Object} passwordData - The password data (currentPassword, newPassword)
   * @returns {Object} - Response data from the server
   */
  const updatePassword = async (passwordData) => {
    try {
      const response = await apiClient.put('/users/password', passwordData); // Ensure this is the correct API route
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error.response || error);
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  };

  /**
   * Load User Profile
   * @returns {Object|null} - The user profile data or null if failed
   */
  const loadUser = useCallback(async () => {
    try {
      console.log("Attempting to load user profile");
      const response = await apiClient.get("/users/profile");
      console.log("User profile loaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error.response || error);
      return null;
    }
  }, []);

  /**
   * User Login
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const login = async (email, password) => {
    try {
      console.log("Attempting login");
      const response = await apiClient.post("/users/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);

      if (response.data.user) {
        // Use user ID as a temporary token
        const tempToken = `temp_token_${response.data.user.id}`;
        console.log("Using temporary token:", tempToken);
        setAccessToken(tempToken);
        setStoredAccessToken(tempToken);
        setApiClientToken(tempToken);
        setUser(response.data.user);
        console.log("Login successful, user set");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      throw error;
    }
  };

  /**
   * Handle User Logout
   */
  const handleLogout = async () => {
    console.log("Logging out");
    await logout();
    setUser(null);
    setAccessToken(null);
    console.log("Logged out, redirecting to login page");
    window.location.href = "/login";
  };

  /**
   * Initialize Authentication on App Load
   */
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth, access token:", accessToken);
      if (accessToken) {
        setApiClientToken(accessToken);
        try {
          const userProfile = await loadUser();
          if (userProfile) {
            console.log("User profile loaded");
            setUser(userProfile);
          } else {
            console.log("Failed to load user profile, clearing access token");
            setAccessToken(null);
            setStoredAccessToken(null);
            setApiClientToken(null);
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          setAccessToken(null);
          setStoredAccessToken(null);
          setApiClientToken(null);
        }
      } else {
        console.log("No access token found");
      }
      setLoading(false);
    };

    initializeAuth();
  }, [accessToken, loadUser]);

  /**
   * Refresh Token Function
   * (Assuming it's already implemented correctly in tokenUtils)
   */
  // const refreshToken = async () => {
  //   // Implementation as per your tokenUtils
  // };

  if (loading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{
      user,
      updateUser,
      updateUserPreferences,
      updatePassword,
      login,
      handleLogout,
      refreshToken,
      accessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
