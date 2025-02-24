from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from core.models import Company, Department, Employee, User

class CompanyViewSetIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            password='testpass123',
            role='admin'
        )
        self.client.force_authenticate(user=self.admin_user)

    def test_company_department_workflow(self):
        # Create company
        company_url = reverse('company-list')
        company_data = {'name': 'Test Company'}
        response = self.client.post(company_url, company_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        company_id = response.data['id']

        # Create department in company
        dept_url = reverse('department-list')
        dept_data = {
            'name': 'Test Department',
            'company': company_id
        }
        response = self.client.post(dept_url, dept_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify department appears in company departments
        company_depts_url = reverse('company-departments', args=[company_id])
        response = self.client.get(company_depts_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)