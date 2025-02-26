import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import EmployeeProfile from './components/admin/EmployeeProfile';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('access_token'); // Check if user is logged in

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/profile/:employeeId" element={isAuthenticated ? <EmployeeProfile /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
