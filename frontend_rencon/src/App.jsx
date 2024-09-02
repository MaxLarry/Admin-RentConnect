// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './assets/components/Login';
import Dashboard from './assets/components/Dashboard';
import withAuth from './assets/components/withAuth';

function App() {
  const ProtectedDashboard = withAuth(Dashboard);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
