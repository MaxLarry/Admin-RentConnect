//publicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Component {...rest} /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;
