import React, { useState } from 'react';
import axios from 'axios';

const AddDepartmentForm = ({ companies, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Department name is required');
      return;
    }
    if (!companyId) {
      setError('Please select a company');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/departments/', 
        { name, company: parseInt(companyId) },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onSubmit();
    } catch (err) {
      setError('Failed to create department');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Department</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="departmentName">Department Name:</label>
          <input
            type="text"
            id="departmentName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company:</label>
          <select
            id="company"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Add Department</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartmentForm;