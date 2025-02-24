from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from core.api.permissions import IsAdminUser, IsManagerUser
from core.models import Company, Department, Employee

class PermissionTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        User = get_user_model()
        self.admin_user = User.objects.create_user(
            email='admin@test.com',
            password='testpass123',
            role='admin'
        )
        self.manager_user = User.objects.create_user(
            email='manager@test.com',
            password='testpass123',
            role='manager'
        )

    def test_admin_permission(self):
        request = self.factory.get('/')
        request.user = self.admin_user
        self.assertTrue(IsAdminUser().has_permission(request, None))

    def test_manager_permission(self):
        request = self.factory.get('/')
        request.user = self.manager_user
        self.assertTrue(IsManagerUser().has_permission(request, None))