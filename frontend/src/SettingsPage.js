

/*import React, { useState, useEffect } from 'react';

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
      
      {// Dark Mode Toggle //}
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

      {// Email Notifications Toggle //}
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

      {// Notification Sounds Toggle //}
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

      {// Add more settings sections as needed //}
    </div>
  );
};

export default Settings;*/

import React, { useState, useEffect } from 'react';
import './SettingPage.css';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="setting-item">
      <span className="setting-label">{label}</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="slider"></span>
      </label>
    </div>
  );

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <ToggleSwitch
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        label="Dark Mode"
      />

      <ToggleSwitch
        checked={notifications}
        onChange={() => setNotifications(!notifications)}
        label="Notifications"
      />

      <ToggleSwitch
        checked={sound}
        onChange={() => setSound(!sound)}
        label="Sound"
      />
    </div>
  );
};

export default SettingsPage;



