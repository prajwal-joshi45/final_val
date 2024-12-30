import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import LandingPage from './component/LandingPage';
import RegisterPage from './component/RegisterPage';
import DashboardPage from './component/DashboardPage';
import Workspace from './component/workspace';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route that redirects to landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        
        {/* Main routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/workspace" element={<Workspace />} />
      

        {/* Catch all route - redirects to landing page if no match */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
};

export default App;