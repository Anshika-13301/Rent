import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  // Agar admin authenticated nahi hai, toh Admin Login page par bhej do
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;