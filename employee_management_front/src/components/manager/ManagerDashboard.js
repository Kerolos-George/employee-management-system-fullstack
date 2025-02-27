import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../admin/AdminDashboard.css';
import DepartmentCard from '../admin/DepartmentCard';
import EmployeesList from '../admin/EmployeesList';
import EmployeeProfile from '../admin/EmployeeProfile';
import AddDepartmentForm from '../admin/forms/AddDepartmentForm';
import AddEmployeeForm from '../admin/forms/AddEmployeeForm';

const ManagerDashboard = () => {
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is manager
    const role = localStorage.getItem('role');
    if (role !== 'manager') {
      navigate('/login');
      return;
    }

    fetchManagerData();
  }, [navigate]);

  const fetchManagerData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Get manager's profile with their company information
      const profileResponse = await axios.get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      

      
      // Get company details
      const companyResponse = await axios.get(`http://localhost:8000/api/companies/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCompany(companyResponse.data[0]);
      
      // Get departments for this company
      const departmentsResponse = await axios.get(`http://localhost:8000/api/departments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDepartments(departmentsResponse.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch company data');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/departments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchManagerData();
      if (selectedDepartment && selectedDepartment.id === id) {
        setSelectedDepartment(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDepartment = async (id, name) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/departments/${id}/`, 
        { name, company: company.id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchManagerData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setSelectedEmployee(null);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedEmployee(null);
  };

  const handleBackToEmployees = () => {
    setSelectedEmployee(null);
  };

  const renderContent = () => {
    if (selectedEmployee) {
      return (
        <EmployeeProfile 
          employeeId={selectedEmployee.id} 
          onBack={handleBackToEmployees}
        />
      );
    }
    
    if (selectedDepartment) {
      return (
        <EmployeesList 
          departmentId={selectedDepartment.id}
          departmentName={selectedDepartment.name}
          companyName={company ? company.name : ''}
          onEmployeeSelect={setSelectedEmployee}
          onBack={handleBackToDepartments}
        />
      );
    }

    if (isLoading) {
      return <p>Loading company data...</p>;
    }
    
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    
    return (
      <div>
        <h2>{company ? `${company.name} Departments` : 'Departments'}</h2>
        <div className="departments-grid">
          {departments.length === 0 ? (
            <p>No departments found. Add a department to get started.</p>
          ) : (
            departments.map(department => (
              <DepartmentCard 
                key={department.id} 
                department={department} 
                onDelete={handleDeleteDepartment}
                onUpdate={handleUpdateDepartment}
                onClick={handleDepartmentClick}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>Manager Dashboard</h1>
        <div className="nav-actions">
          <button onClick={() => setShowAddDepartment(true)}>Add Department</button>
          <button onClick={() => setShowAddEmployee(true)}>Add Employee</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {renderContent()}
      </div>

      {showAddDepartment && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddDepartment(false)}>&times;</span>
            <AddDepartmentForm 
              companies={company ? [company] : []}
              preSelectedCompany={company ? company.id : null}
              onSubmit={() => {
                setShowAddDepartment(false);
                fetchManagerData();
              }}
              onCancel={() => setShowAddDepartment(false)} 
            />
          </div>
        </div>
      )}

      {showAddEmployee && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddEmployee(false)}>&times;</span>
            <AddEmployeeForm 
              companies={company ? [company] : []}
              preSelectedCompany={company ? company.id : null}
              departments={departments}
              onSubmit={() => {
                setShowAddEmployee(false);
                fetchManagerData();
              }}
              onCancel={() => setShowAddEmployee(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;