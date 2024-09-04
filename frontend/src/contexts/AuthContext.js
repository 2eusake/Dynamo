import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUser(response.data))
      .catch(error => console.error('Failed to fetch user', error));
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user); // Make sure the response contains user data
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
