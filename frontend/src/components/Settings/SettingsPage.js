

/*import React from 'react';
import { ChevronRight, Settings, Key, Sun, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SettingsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const settingsOptions = [
    { icon: Settings, title: 'Edit profile', description: 'Change your avatar, email, and username', section: 'Profile', path: '/settings/edit-profile' },
    { icon: Key, title: 'Reset password', description: 'Change your password', section: 'Account', path: '/settings/reset-password' },
    { icon: Sun, title: 'Appearance', description: 'Turn on dark mode', section: 'Account' },
    { icon: Bell, title: 'Notifications', description: 'Receive notifications of important events', section: 'Account' },
  ];

  const SettingsOption = ({ icon: Icon, title, description, onClick }) => {
    const navigate = useNavigate();
    
    return (
      <button
        className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
        onClick={() => onClick(navigate)}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <div className="text-left">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    );
  };
  
  const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
    const settingsOptions = [
      {
        icon: Settings,
        title: 'Edit profile',
        description: 'Change your avatar, email, and username',
        section: 'Profile',
        onClick: (navigate) => {
          navigate('/settings/edit-profile');
        },
      },
      {
        icon: Key,
        title: 'Reset password',
        description: 'Change your password',
        section: 'Account',
        onClick: (navigate) => {
          navigate('/settings/reset-password');
        },
      },
      {
        icon: Sun,
        title: 'Appearance',
        description: `Turn ${isDarkMode ? 'off' : 'on'} dark mode`,
        section: 'Account',
        onClick: async () => {
          await handleDarkModeToggle();
          setIsDarkMode(!isDarkMode);
          document.body.classList.toggle('dark-mode', !isDarkMode); // Add or remove class
        },
      },
      {
        icon: Bell,
        title: 'Notifications',
        description: `${notificationsEnabled ? 'Disable' : 'Enable'} notifications`,
        section: 'Account',
        onClick: async () => {
          await toggleNotifications();
          setNotificationsEnabled(!notificationsEnabled);
        },
      },
    ];
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </header>
        
        <p className="text-gray-500 mb-8">Manage your profile and account settings</p>
        
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
  
  useEffect(() => {
    const storedPreference = localStorage.getItem('dark-mode');
    if (storedPreference === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);
  
  const handleDarkModeToggle = async () => {
    await toggleDarkMode();
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('dark-mode', newMode); // Save preference
  };
  
  /*const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
    const settingsOptions = [
      {
        icon: Settings,
        title: 'Edit profile',
        description: 'Change your avatar, email, and username',
        section: 'Profile',
        onClick: (navigate) => {
          navigate.push('/settings/edit-profile');
        },
      },
      {
        icon: Key,
        title: 'Reset password',
        description: 'Change your password',
        section: 'Account',
        onClick: (navigate) => {
          navigate.push('/settings/reset-password');
        },
      },
      {
        icon: Sun,
        title: 'Appearance',
        description: `Turn ${isDarkMode ? 'off' : 'on'} dark mode`,
        section: 'Account',
        onClick: async () => {
          await toggleDarkMode();
          setIsDarkMode(!isDarkMode);
        },
      },
      {
        icon: Bell,
        title: 'Notifications',
        description: `${notificationsEnabled ? 'Disable' : 'Enable'} notifications`,
        section: 'Account',
        onClick: async () => {
          await toggleNotifications();
          setNotificationsEnabled(!notificationsEnabled);
        },
      },
    ];
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>
        
        <p className="text-gray-500 mb-8">Manage your profile and account settings</p>
        
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
  const handleOptionClick = (path) => {
    if (path) {
      navigate(path); // Navigate to the corresponding path
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      
      <p className="text-gray-500 mb-8">Manage your profile and account settings</p>
      
      <div className="space-y-6">
        {['Profile', 'Account'].map((section) => (
          <div key={section}>
            <h2 className="text-lg font-semibold mb-2">{section}</h2>
            <ul className="space-y-2">
              {settingsOptions
                .filter((option) => option.section === section)
                .map((option, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleOptionClick(option.path)} // Handle button click
                      className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">{option.title}</p>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;*/

import React, { useEffect, useState } from 'react';
import { ChevronRight, Settings, Key, Sun, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context


const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the context
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const toggleNotifications = (enabled) => new Promise((resolve) => setTimeout(() => resolve(enabled), 500));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotificationsEnabled(true); // Default to true for this example
      setIsLoading(false);
    };
    fetchPreferences();
  }, []);

  const handleNotificationsToggle = async () => {
    setIsLoading(true);
    const newState = !notificationsEnabled;
    try {
      await toggleNotifications(newState);
      setNotificationsEnabled(newState);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
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
      className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
      onClick={() => {
        if (onClick) onClick();
        if (path) navigate(path);
      }}
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
        <h1 className="text-2xl font-bold mb-6 underline-green">Settings</h1>
      </header>

      <p className="text-gray-500 mb-8">Manage your profile and account settings</p>

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




