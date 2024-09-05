// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/components/Login';
import Dashboard from './assets/components/Dashboard';
import withAuth from './assets/components/withAuth';
import PublicRoute from './assets/components/publicRoute'; // Import the new PublicRoute HOC
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  const ProtectedDashboard = withAuth(Dashboard);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute component={Login} />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
