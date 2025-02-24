from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

class AuthenticationFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_complete_auth_flow(self):
        # 1. First create a user
        User = get_user_model()
        test_user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # 2. User signs in
        signin_url = reverse('signin')
        credentials = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(signin_url, credentials)
        
      
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data, "No access token in response")
        
        # Rest of the test...