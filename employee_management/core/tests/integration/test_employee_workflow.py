from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from core.models import Company, Department, Employee, User

class EmployeeWorkflowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Setup company and department
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        # Create and login as admin
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            password='testpass123',
            role='admin'
        )
        self.client.force_authenticate(user=self.admin_user)

    def test_complete_employee_lifecycle(self):
        # 1. Create employee
        create_url = reverse('employee-list')
        employee_data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'testpass123',
            'company': self.company.id,
            'department': self.department.id,
            'mobile_number': '1234567890',
            'address': 'Test Address',
            'designation': 'Developer',
            'status': 'active'
        }
        response = self.client.post(create_url, employee_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        employee_id = response.data['id']

        # 2. Update employee role
        update_url = reverse('employee-detail', args=[employee_id])
        update_data = {'role': 'manager'}
        response = self.client.patch(update_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 3. Verify employee in department listing
        dept_employees_url = reverse('department-employees', args=[self.department.id])
        response = self.client.get(dept_employees_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)