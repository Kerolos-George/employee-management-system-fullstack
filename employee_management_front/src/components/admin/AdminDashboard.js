import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import CompanyCard from './CompanyCard';
import DepartmentsList from './DepartmentsList';
import EmployeesList from './EmployeesList';
import EmployeeProfile from './EmployeeProfile';
import AddCompanyForm from './forms/AddCompanyForm';
import AddDepartmentForm from './forms/AddDepartmentForm';
import AddEmployeeForm from './forms/AddEmployeeForm';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/companies/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompanies(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch companies');
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleAddCompany = async (companyData) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/companies/', companyData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowAddCompany(false);
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/companies/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchCompanies();
      if (selectedCompany && selectedCompany.id === id) {
        setSelectedCompany(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCompany = async (id, name) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://localhost:8000/api/companies/${id}/`, { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setSelectedDepartment(null);
    setSelectedEmployee(null);
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setSelectedDepartment(null);
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
          companyName={selectedCompany.name}
          onEmployeeSelect={setSelectedEmployee}
          onBack={handleBackToDepartments}
        />
      );
    }
    
    if (selectedCompany) {
      return (
        <DepartmentsList 
          companyId={selectedCompany.id}
          companyName={selectedCompany.name}
          onDepartmentSelect={setSelectedDepartment}
          onBack={handleBackToCompanies}
        />
      );
    }

    if (isLoading) {
      return <p>Loading companies...</p>;
    }
    
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    
    return (
      <div className="companies-grid">
        {companies.length === 0 ? (
          <p>No companies found. Add a company to get started.</p>
        ) : (
          companies.map(company => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onDelete={handleDeleteCompany}
              onUpdate={handleUpdateCompany}
              onClick={handleCompanyClick}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>Admin Dashboard</h1>
        <div className="nav-actions">
          <button onClick={() => setShowAddCompany(true)}>Add Company</button>
          <button onClick={() => setShowAddDepartment(true)}>Add Department</button>
          <button onClick={() => setShowAddEmployee(true)}>Add Employee</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {renderContent()}
      </div>

      {showAddCompany && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddCompany(false)}>&times;</span>
            <AddCompanyForm onSubmit={handleAddCompany} onCancel={() => setShowAddCompany(false)} />
          </div>
        </div>
      )}

      {showAddDepartment && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddDepartment(false)}>&times;</span>
            <AddDepartmentForm 
              companies={companies} 
              onSubmit={() => {
                setShowAddDepartment(false);
                fetchCompanies();
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
              companies={companies}
              onSubmit={() => {
                setShowAddEmployee(false);
                fetchCompanies();
              }}
              onCancel={() => setShowAddEmployee(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;