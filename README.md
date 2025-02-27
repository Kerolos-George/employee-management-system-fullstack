# Employee Management System

A full-stack application for managing company structure, departments, and employees with role-based access control.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Role-Based Access Control](#role-based-access-control)
  - [Admin Features](#admin-features)
  - [Manager Features](#manager-features)
  - [Employee Features](#employee-features)
- [API Documentation](#api-documentation)
- [Security Implementation](#security-implementation)
- [Component Details](#component-details)
- [Authentication Flow](#authentication-flow)
- [Test Accounts](#test-accounts)
- [Task Completion Status](#task-completion-status)
- [Implementation Details](#implementation-details)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
- [Repository](#repository)
- [License](#license)

## Overview

This Employee Management System is a comprehensive solution that allows organizations to manage their company structure, departments, and employees. The system implements role-based access control with three user roles: Admin, Manager, and Employee, each with different permissions and access levels.

## Features

- **User Authentication**: JWT-based authentication system
- **Role-Based Access Control**: Admin, Manager, and Employee roles
- **Company Management**: Create, view, update, and delete companies
- **Department Management**: Manage departments within companies
- **Employee Management**: Add, edit,delete and manage employee information
- **Profile Management**: Users can view their profiles
- **Dashboard**: View statistics and important information based on role

## Tech Stack

### Backend
- Django 
- Django REST Framework
- Simple JWT for authentication
- SQLite database (configurable to other databases)
- CORS headers for cross-origin requests

### Frontend
- React
- React Router 
- Axios 
- CSS3 for styling components

## Project Structure

### Backend Structure
```
employee_management/
├── core/                  # Main app
│   ├── api/               # API endpoints
│   │   ├── permissions.py # Custom permissions
│   │   ├── serializers.py # Serializers for models
│   │   ├── urls.py        # API routes
│   │   └── views.py       # API views
│   ├── migrations/        # Database migrations
│   ├── tests/             # Test cases
│   │   ├── integration/    # Integration tests
│   │   │   ├── test_auth_flow.py       # Auth flow tests
│   │   │   ├── test_employee_workflow.py # Employee workflow tests
│   │   │   └── test_views.py           # API view tests
│   │   └── unit/          # Unit tests
│   │       ├── test_models.py       # Model unit tests
│   │       ├── test_permissions.py  # Permission unit tests
│   │       └── test_serializers.py  # Serializer unit tests
│   ├── admin.py           # Admin panel configuration
│   ├── models.py          # Database models
│   ├── signals.py         # Signal handlers
│   └── views.py           # API views
├── employee_management/   # Project settings
│   ├── asgi.py           # ASGI configuration
│   ├── settings.py        # Project settings
│   ├── urls.py            # Main URL routing
│   └── wsgi.py            # WSGI configuration
├── db.sqlite3             # SQLite database
├── manage.py              # Django management script
└── requirements.txt       # Project dependencies

```

### Frontend Structure
```
employee_management_front/    # Frontend Application
├── node_modules/             # Node dependencies
├── public/                   # Static files
├── src/                      # Source code
│   ├── components/           # React Components
│   │   ├── admin/            # Admin Components
│   │   │   ├── forms/        # Form components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminDashboard.css
│   │   │   ├── CompanyCard.js
│   │   │   ├── DepartmentCard.js
│   │   │   ├── DepartmentsList.js
│   │   │   ├── EmployeeCard.js
│   │   │   ├── EmployeeProfile.js
│   │   │   ├── EmployeeProfile.css
│   │   │   └── EmployeesList.js
│   │   ├── employee/         # Employee Components
│   │   │   ├── CompanyCard.js
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── EmployeeProfile.js
│   │   │   └── EmployeeProfile.css
│   │   ├── login/            # Login Components
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   └── manager/          # Manager Components
│   │       └── ManagerDashboard.js
│   ├── App.js                # Main App Component
│   ├── App.css               # App CSS
│   ├── App.test.js           # App Tests
│   └── index.css             # Global CSS
└── package.json              # Project dependencies
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14.x or higher
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Kerolos-George/employee-management-system-fullstack.git
cd  employee_management
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Run the development server:
```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000/

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd employee_management_front
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The frontend will be available at http://localhost:3000/

## Role-Based Access Control

The system implements three distinct user roles, each with specific permissions:

### Admin Features
- Full access to all companies, departments, and employees
- Create, update, and delete companies
- Manage departments and employees across all companies
- Access to comprehensive system statistics

### Manager Features
- Limited to managing their assigned company
- Create, update, and delete departments within their company
- Manage employees within their company
- Cannot modify company information

### Employee Features
- Read-only access to company information
- View their profile information
- Limited view of organizational structure

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/signin/` | Sign in with email and password | Public |
| POST | `/api/token/refresh/` | Refresh JWT token | Public |

### Company Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/companies/` | List all companies | Authenticated |
| POST | `/api/companies/` | Create a new company | Admin |
| GET | `/api/companies/{id}/` | Get company details | Authenticated |
| PUT/PATCH | `/api/companies/{id}/` | Update company | Admin |
| DELETE | `/api/companies/{id}/` | Delete company | Admin |
| GET | `/api/companies/{id}/departments/` | List departments in a company | Authenticated |

### Department Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/departments/` | List all departments | Authenticated |
| POST | `/api/departments/` | Create a new department | Admin, Manager |
| GET | `/api/departments/{id}/` | Get department details | Authenticated |
| PUT/PATCH | `/api/departments/{id}/` | Update department | Admin, Manager |
| DELETE | `/api/departments/{id}/` | Delete department | Admin, Manager |
| GET | `/api/departments/{id}/employees/` | List employees in a department | Authenticated |

### Employee Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/employees/` | List all employees | Authenticated (filtered by role) |
| POST | `/api/employees/` | Create a new employee | Admin, Manager |
| GET | `/api/employees/{id}/` | Get employee details | Authenticated (filtered by role) |
| PUT/PATCH | `/api/employees/{id}/` | Update employee | Admin, Manager |
| DELETE | `/api/employees/{id}/` | Delete employee | Admin, Manager |

### User Profile Endpoint

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/profile/` | Get current user profile | Authenticated |
| PUT/PATCH | `/api/profile/` | Update user profile | Authenticated |

## Security Implementation

The application implements several security measures:

1. **JWT Authentication**:
   - Access tokens with 1-day expiration
   - Refresh tokens with 1-day expiration
   - User identification through email claims

2. **Role-Based Access Control**:
   - Custom permission classes (IsAdminUser, IsManagerUser, IsEmployeeUser)
   - Fine-grained access control based on user roles
   - Object-level permissions for managers and employees

3. **Data Protection**:
   - Managers can only access and modify data within their company
   - Employees can only view their own data
   - Password hashing using Django's built-in security

4. **API Security**:
   - CORS configuration to allow only frontend application
   - Input validation and sanitization through serializers

5. **Additional Security Measures**:
   - Validate relationships in nested resources
   - Email uniqueness validation
   - Role assignment restrictions

## Component Details

### Key Frontend Components

1. **Authentication Components**
   - Login: Handles user authentication and redirects based on role

2. **Dashboard Components**
   - AdminDashboard: Complete system management for admins
   - ManagerDashboard: Company-specific management for managers
   - EmployeeDashboard: Limited view for employees

3. **Card Components**
   - CompanyCard: Displays company information with edit/delete options
   - DepartmentCard: Displays department information with edit/delete options

4. **Form Components**
   - AddCompanyForm: Form for creating companies
   - AddDepartmentForm: Form for creating departments
   - AddEmployeeForm: Form for creating employees

5. **List and Profile Components**
   - DepartmentsList: Displays departments within a company
   - EmployeesList: Displays employees within a department
   - EmployeeProfile: Displays and allows editing employee information

## Authentication Flow

1. User logs in with email and password
2. Backend validates credentials and returns JWT access and refresh tokens
3. Frontend stores tokens in localStorage and extracts user role
4. User is redirected to the appropriate dashboard based on role
5. Protected routes check for valid tokens before rendering components
6. API requests include the JWT token in the Authorization header
7. Logout clears tokens from localStorage and redirects to login page

## Test Accounts

You can use the following test accounts to access the system with different role permissions:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@gmail.com | 123456 | Admin | Full system access with all privileges |
| mohamed@gmail.com | 123456789 | Manager | Company-specific management access |
| asmaa@gmail.com | 123456789 | Employee | Limited view access |

## Task Completion Status

| Task | Status | Notes |
|------|--------|-------|
| User Authentication | ✅ Complete | JWT authentication with role-based access |
| Company Management | ✅ Complete | CRUD operations with proper permissions |
| Department Management | ✅ Complete | CRUD operations with proper permissions |
| Employee Management | ✅ Complete | CRUD operations with proper permissions |
| Role-Based Access Control | ✅ Complete | Admin, Manager, and Employee roles with appropriate permissions |
| Frontend Development | ✅ Complete | React frontend with proper state management |
| API Documentation | ✅ Complete | All endpoints documented in README |
| Security Implementation | ✅ Complete | JWT, RBAC, CORS, data validation |
| Testing | ✅ Complete | Unit and integration tests for API endpoints |

## Implementation Details

### Backend Approach

1. **Custom User Model**:
   - Extended Django's AbstractUser with custom fields
   - Implemented a custom UserManager for email-based authentication
   - Role-based access control with three predefined roles

2. **Model Relationships**:
   - Company -> Department -> Employee hierarchy
   - OneToOne relationship between User and Employee
   - Proper cascade deletion to maintain data integrity

3. **API Design**:
   - RESTful API following REST best practices
   - ViewSets for resource-based operations
   - Serializers for data validation and transformation
   - Custom permissions for role-based access

4. **Signal Handlers**:
   - Automatic updates for department and employee counts
   - Ensures data consistency across relationships

### Frontend Approach

1. **Component Architecture**:
   - Reusable UI components for consistent design
   - Page components for different sections of the application

2. **State Management**:
   - Local component state for UI interactions and form data
   - JWT token storage in localStorage
   - Protected route implementation

3. **Authentication Flow**:
   - JWT token handling for protected routes
   - Role-based routing and component rendering
   - Proper error handling for authentication failures

4. **User Experience**:
   - Intuitive navigation with clear hierarchy
   - Modal forms for creating and editing resources
   - Consistent UI across all components
   - Responsive design for mobile and desktop

## Testing

The application includes comprehensive testing to ensure functionality, security, and proper behavior across all components.

### Unit Tests

Unit tests focus on verifying the functionality of individual components such as models, serializers, and permissions.

1. **Model Tests**:
   - The **User model test** checks if a user can be created with the correct email and password.
   - The **Company model test** ensures that a company is created with default values like `number_of_departments` and `number_of_employees` set to zero.

2. **Permission Tests**:
   - **Admin permission test** checks if admin users are granted access.
   - **Manager permission test** verifies that manager users are allowed access.

3. **Serializer Tests**:
   - The **Company serializer test** ensures that the serialized company data contains expected fields.
   - The **Email uniqueness test** checks if the serializer correctly validates unique email addresses.

### Integration Tests

Integration tests verify how different components interact with each other.

1. **Authentication Flow Tests**:
   - Create a user.
   - Sign in with the correct credentials.
   - Check if the API returns an access token.

2. **Employee Workflow Tests**:
   - Create an employee.
   - Update the employee's role.
   - Confirm the employee appears in the department listing.

3. **Company-Department Workflow Tests**:
   - A company can be created.
   - Departments can be added to the company.
   - The department is correctly listed under the company.

### How to Run the Tests

The tests can be executed using the following command:

```bash
python manage.py test core.tests
```



