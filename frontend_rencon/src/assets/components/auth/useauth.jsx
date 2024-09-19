// auth/useAuth.jsx
import React,{ useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/checkAuth');
        setIsAuthenticated(response.data.isAuthenticated);
        //console.log(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          //console.log(response.data.user.name);
          setUser(response.data.user); // Store all user data
          //console.log(response.data.user.profilePicture); //debugging
          //console.log(setUser);//debugginngg
        }
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
      // Make a POST request to your logout route
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false); // Update auth state
      setUser(null); // Reset user data on logout
      window.location.href = '/'; // Redirect after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return { user, isAuthenticated, loading, logout };
};

export default useAuth;
