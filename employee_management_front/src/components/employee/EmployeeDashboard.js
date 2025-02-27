import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CompanyCard from './CompanyCard';
import EmployeeProfile from './EmployeeProfile';
import '../admin/AdminDashboard.css';

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewProfile, setViewProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is employee
    const role = localStorage.getItem('role');
    if (role !== 'employee') {
      navigate('/login');
      return;
    }

    fetchEmployeeData();
  }, [navigate]);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Get employee's profile
      const profileResponse = await axios.get('http://localhost:8000/api/employees/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const profileData = profileResponse.data[0];
      setProfile(profileData);

      // Fetch company data from the companies endpoint
      const companiesResponse = await axios.get('http://localhost:8000/api/companies/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCompanies(companiesResponse.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch employee data');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleViewProfile = () => {
    setViewProfile(true);
  };

  const handleBackToDashboard = () => {
    setViewProfile(false);
  };

  const renderContent = () => {
    if (viewProfile && profile) {
      return (
        <EmployeeProfile 
          employeeData={profile}
          onBack={handleBackToDashboard}
          readOnly={true}
        />
      );
    }
    
    if (isLoading) {
      return <p>Loading employee data...</p>;
    }
    
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    
    return (
      <div>
        <h2>{profile ? `${profile.name}'s Dashboard` : 'Employee Dashboard'}</h2>
        <div className="companies-grid">
          {companies.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            companies.map((company) => (
              <CompanyCard 
                key={company.id} 
                company={company}
                onClick={() => setViewProfile(true)}
              />
            ))
          )}
        </div>
     
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>Employee Dashboard</h1>
        <div className="nav-actions">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;