// src/components/admin/CompanyCard.js
import React, { useState } from 'react';

const CompanyCard = ({ company, onDelete, onUpdate, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(company.name);

  const handleUpdate = () => {
    onUpdate(company.id, name);
    setIsEditing(false);
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on edit/delete buttons or while editing
    if (isEditing || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('button') ||
        e.target.tagName === 'INPUT') {
      return;
    }
    onClick(company);
  };

  return (
    <div 
      className="company-card"
      onClick={handleCardClick}
      style={{ cursor: isEditing ? 'default' : 'pointer' }}
    >
      <div className="company-header">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="edit-name-input"
          />
        ) : (
          <h3>{company.name}</h3>
        )}
      </div>
      <div className="company-stats">
        <p>Departments: {company.number_of_departments}</p>
        <p>Employees: {company.number_of_employees}</p>
      </div>
      <div className="company-actions">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(company.id); }} className="delete-btn">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;