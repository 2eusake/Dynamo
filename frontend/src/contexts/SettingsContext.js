// src/contexts/SettingsContext.js
import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState([
    { id: 1, name: 'Notification', value: true },
    { id: 2, name: 'Auto-Save', value: false },
    { id: 3, name: 'Dark Mode', value: false },
  ]);

  const createSetting = (setting) => {
    setSettings([...settings, { ...setting, id: settings.length + 1 }]);
  };

  const updateSetting = (updatedSetting) => {
    setSettings(settings.map(setting => (setting.id === updatedSetting.id ? updatedSetting : setting)));
  };

  const deleteSetting = (id) => {
    setSettings(settings.filter(setting => setting.id !== id));
  };

  return (
    <SettingsContext.Provider value={{ settings, createSetting, updateSetting, deleteSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
