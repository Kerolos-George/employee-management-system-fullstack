# views.py
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.serializers import ValidationError 
from django.shortcuts import get_object_or_404
from .serializers import (
    CompanySerializer, DepartmentSerializer, EmployeeSerializer, EmployeeUpdateSerializer,
    UserSerializer, EmployeeCreateSerializer
)
from core.models import Company, Department, Employee, User
from .permissions import IsAdminUser, IsManagerUser, IsEmployeeUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer
from core.api import serializers


class SignInView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = serializer.user
        tokens = serializer.validated_data

        response_data = {
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': {
                'id':user.id,
                'email': user.email,
                'role': user.role,
                'name': user.get_full_name()
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Company.objects.all()
        elif user.role in ['manager', 'employee']:
            return Company.objects.filter(id=user.employee.company.id)
        return Company.objects.none()

    @action(detail=True, methods=['get'])
    def departments(self, request, pk=None):
        company = self.get_object()
        departments = company.departments.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser|IsManagerUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Department.objects.all()
        elif user.role in ['manager', 'employee']:
            return Department.objects.filter(company=user.employee.company)
        return Department.objects.none()

    serializer_class = DepartmentSerializer
    
    def perform_create(self, serializer):
        if self.request.user.role == 'manager':
            # For managers, automatically use their company
            serializer.save(company=self.request.user.employee.company)
        else:
            # For admin, require company_id in request
            company_id = self.request.data.get('company')
            if not company_id:
                raise serializers.ValidationError({
                    'company': 'Company ID is required'
                })
            company = get_object_or_404(Company, id=company_id)
            serializer.save(company=company)

    @action(detail=True, methods=['get'])
    def employees(self, request, pk=None):
        department = self.get_object()
        employees = department.employees.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

class EmployeeViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == 'create':
            return EmployeeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return EmployeeUpdateSerializer
        return EmployeeSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser|IsManagerUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Employee.objects.all()
        elif user.role == 'manager':
            return Employee.objects.filter(company=user.employee.company)
        elif user.role == 'employee':
            return Employee.objects.filter(id=user.employee.id)
        return Employee.objects.none()
    def perform_create(self, serializer):
        if self.request.user.role == 'manager':
            # For managers, force their company
            serializer.save(company=self.request.user.employee.company)
        else:
            # For admin, allow specified company
            serializer.save()
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get the logged-in user
        user = self.request.user

        # Get the associated Employee object
        employee = get_object_or_404(Employee, user=user)

        return employee


