// src/components/admin/EmployeeCard.js
import React from 'react';

const EmployeeCard = ({ employee, onClick }) => {
  return (
    <div 
      className="employee-card"
      onClick={onClick}
    >
      <div className="employee-header">
        <h3>{employee.name}</h3>
      </div>
      <div className="employee-stats">
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Days Employed:</strong> {employee.days_employed}</p>
      </div>
      <div className="view-profile">
        <span>View Profile &rarr;</span>
      </div>
    </div>
  );
};

export default EmployeeCard;