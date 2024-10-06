import React, { createContext, useState, useCallback } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState({});

  const getUser = useCallback(async (id) => {
    if (users[id]) {
      return users[id];
    }

    // This is where you'd typically make an API call
    const response = await fetch(`/api/users/${id}`);
    const userData = await response.json();

    setUsers(prevUsers => ({
      ...prevUsers,
      [id]: userData
    }));

    return userData;
  }, [users]);

  return (
    <UserContext.Provider value={{ getUser }}>
      {children}
    </UserContext.Provider>
  );
};