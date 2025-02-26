// src/components/admin/forms/AddCompanyForm.js
import React, { useState } from 'react';

const AddCompanyForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Company name is required');
      return;
    }
    onSubmit({ name });
  };

  return (
    <div className="form-container">
      <h2>Add New Company</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Add Company</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyForm;