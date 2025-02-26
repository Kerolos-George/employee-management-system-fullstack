// src/components/admin/EmployeesList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeCard from './EmployeeCard';

const EmployeesList = ({ departmentId, departmentName, companyName, onEmployeeSelect, onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [departmentId]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/departments/${departmentId}/employees/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setIsLoading(false);
      console.error(err);
    }
  };

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="employees-container">
      <div className="list-header">
        <button onClick={onBack} className="back-btn">
          &larr; Back to {companyName} Departments
        </button>
        <h2>{departmentName} Employees</h2>
      </div>
      
      <div className="employees-grid">
        {employees.length === 0 ? (
          <p>No employees found in this department.</p>
        ) : (
          employees.map(employee => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee} 
              onClick={() => onEmployeeSelect(employee)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeesList;