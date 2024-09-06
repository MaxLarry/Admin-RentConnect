// withAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';


const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated, loading} = useAuth();

    if (loading) {
      return <div>Loading...</div>; // Optionally, show a loading indicator
    }

    return isAuthenticated ? <Component {...props} /> : <Navigate to="/" />;
  };
};

export default withAuth;
