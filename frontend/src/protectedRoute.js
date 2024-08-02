// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext'; 

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
