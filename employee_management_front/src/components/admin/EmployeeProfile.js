import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EmployeeProfile.css';

const EmployeeProfile = ({ employeeId, onBack }) => {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeDetails();

    // Handle browser back button
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate('/dashboard');  // Redirect to dashboard
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [employeeId, navigate]);

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployee(response.data);
      setFormData(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch employee details');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const { email, ...dataToSubmit } = formData;
      await axios.patch(`http://localhost:8000/api/employees/${employeeId}/`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployeeDetails();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onBack(); // Go back to the employees list after successful deletion
    } catch (err) {
      console.error(err);
      setError('Failed to delete employee');
    }
  };

  if (isLoading) return <p>Loading employee details...</p>;
  if (error) return <p>{error}</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="employee-profile">
      <button className="back-button" onClick={onBack}>← Back to Employees</button>
      <h2>Employee Profile</h2>
      {isEditing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} /></label>
          <label>Role: <input type="text" name="role" value={formData.role} onChange={handleChange} /></label>
          <label>Status: <input type="text" name="status" value={formData.status} onChange={handleChange} /></label>
          <label>Mobile Number: <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} /></label>
          <label>Address: <input type="text" name="address" value={formData.address} onChange={handleChange} /></label>
          <label>Designation: <input type="text" name="designation" value={formData.designation} onChange={handleChange} /></label>
          <label>Hired On: <input type="date" name="hired_on" value={formData.hired_on} onChange={handleChange} /></label>
          <div className="form-buttons">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Role:</strong> {employee.role}</p>
          <p><strong>Status:</strong> {employee.status}</p>
          <p><strong>Mobile Number:</strong> {employee.mobile_number}</p>
          <p><strong>Address:</strong> {employee.address}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Hired On:</strong> {employee.hired_on}</p>
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
          <button className="delete-button" onClick={() => setShowConfirmDelete(true)}>Delete Employee</button>
        </div>
      )}

      {showConfirmDelete && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete {employee.name}? This action cannot be undone.</p>
            <div className="form-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-button" 
                onClick={handleDeleteEmployee}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;