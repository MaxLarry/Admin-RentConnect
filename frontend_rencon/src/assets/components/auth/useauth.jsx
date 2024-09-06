// auth/useAuth.jsx
import React,{ useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/checkAuth');
        setIsAuthenticated(response.data.isAuthenticated);
        //console.log(response.data.isAuthenticated);
      } catch (error) {
        //console.error('Error during checkAuth:', error);
        setIsAuthenticated(false);
      }finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setIsAuthenticated(false); // Reset authentication state
      window.location.href = '/'; // Redirect to login or home page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { isAuthenticated, loading, logout };
};

export default useAuth;
