from django.test import TestCase
from core.api.serializers import (
    CompanySerializer, DepartmentSerializer, 
    EmployeeCreateSerializer, EmployeeUpdateSerializer
)
from core.models import Company, Department, Employee, User

class CompanySerializerTests(TestCase):
    def test_serialize_company(self):
        company = Company.objects.create(name='Test Company')
        serializer = CompanySerializer(company)
        self.assertEqual(serializer.data['name'], 'Test Company')
        self.assertIn('number_of_departments', serializer.data)
        self.assertIn('number_of_employees', serializer.data)

class EmployeeCreateSerializerTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')
        self.department = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.valid_data = {
            'name': 'Test Employee',
            'email': 'employee@test.com',
            'password': 'testpass123',
            'company': self.company.id,
            'department': self.department.id,
            'mobile_number': '1234567890',
            'address': 'Test Address',
            'designation': 'Developer'
        }

    def test_validate_email_unique(self):
        User.objects.create_user(
            email='employee@test.com',
            password='testpass123'
        )
        serializer = EmployeeCreateSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)