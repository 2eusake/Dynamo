
/*
// src/components/Settings.js
import React, { useState, useEffect } from 'react';

import './DarkMode.css';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');
    const savedTheme = localStorage.getItem('theme');
    if (savedUsername) setUsername(savedUsername);
    if (savedEmail) setEmail(savedEmail);
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSave = (e) => {
    e.preventDefault(); // Prevent form submission
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    console.log('Settings saved:', { username, email, darkMode });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-deloitte-dark-green">Settings</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Dark Mode:</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </div>
        <button type="submit"
          className=" p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Save
        </button>
      </form>
      
    </div>
  );
};

export default Settings;*/

import React, { useState, useEffect } from 'react';

// Helper functions for local storage
const getSettings = () => ({
  darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,
  emailNotifications: JSON.parse(localStorage.getItem('emailNotifications')) || true,
  notificationSounds: JSON.parse(localStorage.getItem('notificationSounds')) || true,
});

const saveSettings = (settings) => {
  localStorage.setItem('darkMode', JSON.stringify(settings.darkMode));
  localStorage.setItem('emailNotifications', JSON.stringify(settings.emailNotifications));
  localStorage.setItem('notificationSounds', JSON.stringify(settings.notificationSounds));
};

const Settings= () => {
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings, [name]: checked };
      saveSettings(newSettings);
      return newSettings;
    });
  };

  return (
    <div className="settings-page container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Settings</h2>
      
      {/* Dark Mode Toggle */}
      <div className="setting-item mb-4">
        <label className="flex items-center cursor-pointer">
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 mr-4">Dark Mode</span>
          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </label>
      </div>

      {/* Email Notifications Toggle */}
      <div className="setting-item mb-4">
        <label className="flex items-center cursor-pointer">
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 mr-4">Email Notifications</span>
          <input
            type="checkbox"
            name="emailNotifications"
            checked={settings.emailNotifications}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </label>
      </div>

      {/* Notification Sounds Toggle */}
      <div className="setting-item mb-4">
        <label className="flex items-center cursor-pointer">
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 mr-4">Notification Sounds</span>
          <input
            type="checkbox"
            name="notificationSounds"
            checked={settings.notificationSounds}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
        </label>
      </div>

      {/* Add more settings sections as needed */}
    </div>
  );
};

export default Settings;




