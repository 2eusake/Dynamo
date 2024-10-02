// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from './contexts/AuthContext';

// const ProtectedRoute = ({ element, allowedRoles }) => {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" />;
//   }

//   return element;
// };

// export default ProtectedRoute;
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext'; // Ensure correct path to your AuthContext

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  // Check if the user has the correct role to access this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('Access denied for role:', user.role);
    return <Navigate to="/unauthorized" />; // Redirect to unauthorized page
  }

  // If everything is fine, render the component
  return element;
};

export default ProtectedRoute;
