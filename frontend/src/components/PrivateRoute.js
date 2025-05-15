import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
