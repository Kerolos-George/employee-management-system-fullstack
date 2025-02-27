import React, { useState } from 'react';

const DepartmentCard = ({ department, onDelete, onUpdate, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(department.name);

  const handleUpdate = () => {
    onUpdate(department.id, name);
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
    onClick(department);
  };

  return (
    <div 
      className="department-card"
      onClick={handleCardClick}
      style={{ cursor: isEditing ? 'default' : 'pointer' }}
    >
      <div className="department-header">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="edit-name-input"
          />
        ) : (
          <h3>{department.name}</h3>
        )}
      </div>
      <div className="department-stats">
        <p>Employees: {department.number_of_employees}</p>
      </div>
      <div className="department-actions">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(department.id); }} 
              className="delete-btn"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentCard;