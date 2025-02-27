import React from 'react';

const CompanyCard = ({ company, onClick }) => {
  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    onClick(company);
  };

  return (
    <div 
      className="company-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="company-header">
        <h3>{company.name}</h3>
      </div>
      <div className="company-stats">
        <p>Departments: {company.number_of_departments}</p>
        <p>Employees: {company.number_of_employees}</p>
      </div>
      <div className="company-actions">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClick(company);
          }} 
          className="view-profile-btn"
        >
          View My Profile
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;