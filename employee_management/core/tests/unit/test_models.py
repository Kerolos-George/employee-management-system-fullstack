from django.test import TestCase
from django.contrib.auth import get_user_model
from core.models import Company, Department, Employee
from datetime import date

class UserModelTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertEqual(user.role, 'employee')

    def test_normalize_email(self):
        User = get_user_model()
        email = 'test@EXAMPLE.com'
        user = User.objects.create_user(email=email, password='testpass123')
        self.assertEqual(user.email, email.lower())

class CompanyModelTests(TestCase):
    def test_company_creation(self):
        company = Company.objects.create(name='Test Company')
        self.assertEqual(str(company), 'Test Company')
        self.assertEqual(company.number_of_departments, 0)
        self.assertEqual(company.number_of_employees, 0)

class DepartmentModelTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='Test Company')

    def test_department_creation(self):
        dept = Department.objects.create(
            name='Test Department',
            company=self.company
        )
        self.assertEqual(str(dept), 'Test Department')
        self.assertEqual(dept.number_of_employees, 0)