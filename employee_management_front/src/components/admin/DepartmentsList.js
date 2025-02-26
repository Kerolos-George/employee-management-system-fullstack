// src/components/admin/DepartmentsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentCard from './DepartmentCard';

const DepartmentsList = ({ companyId, companyName, onDepartmentSelect, onBack }) => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, [companyId]);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/companies/${companyId}/departments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartments(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch departments');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/departments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDepartment = async (id, name) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/departments/${id}/`, 
        { name, company: companyId }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <p>Loading departments...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="departments-container">
      <div className="list-header">
        <button onClick={onBack} className="back-btn">
          &larr; Back to Companies
        </button>
        <h2>{companyName} Departments</h2>
      </div>
      
      <div className="departments-grid">
        {departments.length === 0 ? (
          <p>No departments found for this company.</p>
        ) : (
          departments.map(department => (
            <DepartmentCard 
              key={department.id} 
              department={department} 
              onDelete={handleDeleteDepartment}
              onUpdate={handleUpdateDepartment}
              onClick={() => onDepartmentSelect(department)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentsList;