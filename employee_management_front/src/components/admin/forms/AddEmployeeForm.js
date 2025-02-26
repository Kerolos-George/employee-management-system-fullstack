// src/components/admin/forms/AddEmployeeForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployeeForm = ({ companies, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    department: '',
    mobile_number: '',
    address: '',
    designation: '',
    hired_on: new Date().toISOString().split('T')[0],
    status: 'active',
    role: 'employee'
  });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.company) {
      fetchDepartments(formData.company);
    } else {
      setDepartments([]);
      setFormData(prev => ({ ...prev, department: '' }));
    }
  }, [formData.company]);

  const fetchDepartments = async (companyId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:8000/api/companies/${companyId}/departments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user changes a field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone number validation
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Phone number must be 11 digits';
    }
    
    // Required fields validation
    const requiredFields = ['name', 'email', 'password', 'company', 'department', 
                            'address', 'designation', 'hired_on'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `This field is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        ...formData,
        company: parseInt(formData.company),
        department: parseInt(formData.department)
      };
      
      await axios.post('http://localhost:8000/api/employees/', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onSubmit();
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle API validation errors
        const apiErrors = {};
        Object.entries(err.response.data).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'Failed to create employee' });
      }
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Employee</h2>
      {errors.general && <p className="error-message">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            type="text"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="11 digits required"
          />
          {errors.mobile_number && <p className="field-error">{errors.mobile_number}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="field-error">{errors.address}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
          {errors.designation && <p className="field-error">{errors.designation}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="hired_on">Hired On:</label>
          <input
            type="date"
            id="hired_on"
            name="hired_on"
            value={formData.hired_on}
            onChange={handleChange}
          />
          {errors.hired_on && <p className="field-error">{errors.hired_on}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="field-error">{errors.role}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Company:</label>
          <select
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          {errors.company && <p className="field-error">{errors.company}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!formData.company}
          >
            <option value="">
              {formData.company ? 'Select a department' : 'Select a company first'}
            </option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {errors.department && <p className="field-error">{errors.department}</p>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">Add Employee</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;