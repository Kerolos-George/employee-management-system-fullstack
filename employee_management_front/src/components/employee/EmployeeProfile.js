import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeProfile.css';

const EmployeeProfile = ({ employeeData, employeeId, onBack }) => {
  const [employee, setEmployee] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(!employeeData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If employeeData is provided directly, use it
    if (employeeData) {
      setEmployee(employeeData);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch data if employeeId is provided
    if (employeeId) {
      fetchEmployeeDetails();
    } else {
      // If neither employeeData nor employeeId is provided, try to fetch current user's profile
      fetchCurrentUserProfile();
    }
  }, [employeeData, employeeId]);

  useEffect(() => {
    // Fetch company and department details once employee data is available
    if (employee) {
      fetchCompanyAndDepartmentDetails();
    }
  }, [employee]);

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/employees/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployee(response.data[0]);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch employee details');
      setIsLoading(false);
      console.error(err);
    }
  };

  const fetchCurrentUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        setError('User ID not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/employee/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployee(response.data[0]);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch your profile');
      setIsLoading(false);
      console.error(err);
    }
  };

  const fetchCompanyAndDepartmentDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');

      // Fetch company name
      if (employee.company) {
        const companyResponse = await axios.get(`http://localhost:8000/api/companies/${employee.company}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanyName(companyResponse.data.name);
      }

      // Fetch department name
      if (employee.department) {
        const departmentResponse = await axios.get(`http://localhost:8000/api/departments/${employee.department}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepartmentName(departmentResponse.data.name);
      }
    } catch (err) {
      console.error('Failed to fetch company or department details:', err);
    }
  };

  if (isLoading) return (
    <div className="employee-profile">
      <button className="back-button" onClick={onBack}>← Back to Dashboard</button>
      <div className="loading-spinner">Loading employee details...</div>
    </div>
  );

  if (error) return (
    <div className="employee-profile">
      <button className="back-button" onClick={onBack}>← Back to Dashboard</button>
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => {
          setIsLoading(true);
          setError(null);
          employeeId ? fetchEmployeeDetails() : fetchCurrentUserProfile();
        }}>Retry</button>
      </div>
    </div>
  );

  if (!employee) return (
    <div className="employee-profile">
      <button className="back-button" onClick={onBack}>← Back to Dashboard</button>
      <p className="no-data-message">Employee information not available.</p>
    </div>
  );

  // Format date if it exists (YYYY-MM-DD to readable format)
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="employee-profile">
      <button className="back-button" onClick={onBack}>← Back to Dashboard</button>
      <h2>Employee Profile</h2>
      <div className="profile-details">
        {employee.profile_image && (
          <div className="profile-image-container">
            <img
              src={employee.profile_image}
              alt={`${employee.name}'s profile`}
              className="profile-image"
            />
          </div>
        )}

        <div className="profile-section">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {employee.name || 'Not provided'}</p>
          <p><strong>Email:</strong> {employee.email || 'Not provided'}</p>
          <p><strong>Mobile Number:</strong> {employee.mobile_number || 'Not provided'}</p>
          <p><strong>Address:</strong> {employee.address || 'Not provided'}</p>
        </div>

        <div className="profile-section">
          <h3>Work Information</h3>
          <p><strong>Role:</strong> {employee.role || 'Not specified'}</p>
          <p><strong>Status:</strong> {employee.status || 'Active'}</p>
          <p><strong>Designation:</strong> {employee.designation || 'Not provided'}</p>
          <p><strong>Hired On:</strong> {formatDate(employee.hired_on)}</p>
          <p><strong>Department:</strong> {departmentName || 'Not assigned'}</p>
          <p><strong>Company:</strong> {companyName || 'Not assigned'}</p>
        </div>

        {employee.skills && employee.skills.length > 0 && (
          <div className="profile-section">
            <h3>Skills</h3>
            <div className="skills-container">
              {employee.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {employee.bio && (
          <div className="profile-section">
            <h3>About Me</h3>
            <p className="employee-bio">{employee.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;