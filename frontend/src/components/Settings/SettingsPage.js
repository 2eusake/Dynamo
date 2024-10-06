// src/components/SettingsPage.js

import React, { useEffect, useState, useContext } from 'react';
import { ChevronRight, Settings, Key, Sun, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import { Button } from "../UIComp";
import Spinner from '../Common/Spinner'; // Ensure Spinner is correctly imported

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the context
  const { user, updateUserPreferences } = useContext(AuthContext); // Get user and updateUserPreferences from AuthContext
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch user preferences from the user object
    if (user && user.preferences) {
      setNotificationsEnabled(user.preferences.notificationsEnabled);
    }
  }, [user]);

  const handleNotificationsToggle = async () => {
    setIsLoading(true);
    const newState = !notificationsEnabled;
    try {
      // Update preferences via API
      await updateUserPreferences({ notificationsEnabled: newState });
      setNotificationsEnabled(newState);
      setSuccessMessage(`Notifications ${newState ? 'enabled' : 'disabled'} successfully!`);
      setError(null);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      setError('Failed to update notifications. Please try again.');
    }
    setIsLoading(false);
  };

  const settingsOptions = [
    { icon: Settings, title: 'Edit profile', description: 'Change your avatar, email, and username', section: 'Profile', path: '/settings/edit-profile' },
    { icon: Key, title: 'Reset password', description: 'Change your password', section: 'Account', path: '/settings/reset-password' },
    { icon: Sun, title: 'Appearance', description: `Turn ${isDarkMode ? 'off' : 'on'} dark mode`, section: 'Account', onClick: toggleDarkMode },
   
  ];

  const SettingsOption = ({ icon: Icon, title, description, onClick, path, toggle, isToggled }) => (
    <button
      className={`w-full flex items-center justify-between p-3 rounded-lg shadow hover:bg-gray-50 transition-colors ${
        isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white text-black'
      }`}
      onClick={() => {
        if (onClick) onClick();
        if (path) navigate(path);
      }}
      disabled={toggle && isLoading} // Disable if toggling and loading
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <div className="text-left">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      
      {toggle ? (
        isToggled ? <ToggleRight className="w-6 h-6 text-blue-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
      
    </button>
  );

  return (
    <div className={`max-w-2xl mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold mb-6 underline-green ${isDarkMode ? ' text-white' : ' text-black'}`}>Settings</h1>
      </header>

      {/* Display loading spinner if preferences are being updated */}
      {isLoading && <Spinner />}

      {/* Success message */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-6">
        {['Profile', 'Account'].map((section) => (
          <div key={section}>
            <h2 className="text-lg font-semibold mb-2">{section}</h2>
            <ul className="space-y-2">
              {settingsOptions
                .filter((option) => option.section === section)
                .map((option, index) => (
                  <li key={index}>
                    <SettingsOption {...option} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
