import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/components/ui/Login';
import Dashboard from './assets/components/routes/dashboard/Dashboard';
import ListingManagement from './assets/components/routes/listmanagement/listingManagement';
import withAuth from './assets/components/auth/withAuth';
import PublicRoute from './assets/components/auth/publicRoute';
import Layout from './assets/components/ui/Layout'; // New Layout Component
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Persist dark mode state in localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  const ProtectedDashboard = withAuth(Dashboard);
  const ProtectedListingManagement = withAuth(ListingManagement);

  return (
    <Router>
      <Routes>
        {/* Public route without Header and Sidebar */}
        <Route path="/" element={<PublicRoute component={Login} />} />

        {/* Protected routes with Header and Sidebar */}
        <Route path="/" element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/listing_management" element={<ProtectedListingManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
