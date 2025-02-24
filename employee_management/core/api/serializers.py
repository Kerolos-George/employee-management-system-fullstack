# serializers.py
from rest_framework import serializers
from rest_framework.serializers import ValidationError
from core.models import Company, Department, Employee, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # Since we're using email for authentication

    def validate(self, attrs):
        data = super().validate(attrs)
        self.user.role = self.user.role
        return data


class UserSerializer(serializers.ModelSerializer):
    # Fields from the User model
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)

    # Fields from the Employee model
    mobile_number = serializers.CharField(read_only=True)
    address = serializers.CharField(read_only=True)
    hired_on = serializers.DateField(read_only=True)
    designation = serializers.CharField(read_only=True)

    class Meta:
        model = Employee
        fields = (
            'id', 'email', 'first_name', 'last_name', 'role',
            'mobile_number', 'address', 'hired_on', 'designation'
        )

class CompanySerializer(serializers.ModelSerializer):
    number_of_departments = serializers.IntegerField(read_only=True)
    number_of_employees = serializers.IntegerField(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    number_of_employees = serializers.IntegerField(read_only=True)

    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ('company',)

class EmployeeSerializer(serializers.ModelSerializer):
    days_employed = serializers.IntegerField(read_only=True)
    user = UserSerializer(read_only=True)
    role = serializers.SerializerMethodField()  # Add role
    email = serializers.SerializerMethodField()  # Add email

    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('user', 'company')

    # Method to get the role from the related User model
    def get_role(self, obj):
        return obj.user.role  # Assuming 'role' is a field in the User model

    # Method to get the email from the related User model
    def get_email(self, obj):
        return obj.user.email  # Assuming 'email' is a field in the User model


class EmployeeCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Employee
        fields = (
            'id', 'name', 'email', 'password', 'company', 'department',
            'mobile_number', 'address', 'designation', 'hired_on', 'status'
        )
        # Remove company from read_only_fields since we need it in validated_data
        # read_only_fields = ('company',)  

    def validate(self, data):
        request = self.context.get('request')
        user = request.user if request else None
        
        # Validate email uniqueness
        if User.objects.filter(email=data.get('email')).exists():
            raise ValidationError({
                'email': 'User with this email already exists.'
            })

        # Get department and company from the request data
        department = data.get('department')
        company = data.get('company')

        if not department:
            raise ValidationError({
                'department': 'Department is required'
            })

        if not company:
            raise ValidationError({
                'company': 'Company is required'
            })

        # Check if department belongs to the specified company
        if department.company.id != company.id:
            raise ValidationError({
                'department': f'Department {department.name} does not belong to company {company.name}'
            })

        # For managers, validate they're creating employee for their own company
        if user and user.role == 'manager':
            if company.id != user.employee.company.id:
                raise ValidationError({
                    'company': 'You can only create employees for your own company'
                })

        return data

    def create(self, validated_data):
        # Extract user-related data
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        name = validated_data.get('name', '')

        # Create user
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=name.split()[0] if name else '',
            last_name=' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
            role='employee'
        )

        # Create employee with all validated data including company
        employee = Employee.objects.create(
            user=user,
            **validated_data
        )
        return employee
    
class EmployeeUpdateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLES, required=False)
    email = serializers.EmailField(required=False)
    name = serializers.CharField(required=False) 
    
    class Meta:
        model = Employee
        fields = (
            'name', 'department', 'mobile_number', 
            'address', 'designation', 'hired_on', 
            'status', 'role', 'email', 
        )
        
    def validate(self, data):
        request = self.context.get('request')
        user = request.user if request else None
        
        # If department is being updated, validate company relationship
        if 'department' in data:
            department = data['department']
            if user.role == 'manager':
                if department.company != user.employee.company:
                    raise ValidationError({
                        'department': 'Department does not belong to your company'
                    })
                    
        # Only admin can update role
        if 'role' in data and user.role not in ['admin', 'manager']:
            raise ValidationError({
                'role': 'Only admin or manager can update role'
            })
            
        # Validate email uniqueness if email is being updated
        if 'email' in data:
            if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
                raise ValidationError({
                    'email': 'User with this email already exists.'
                })
            
        return data
        
    def update(self, instance, validated_data):
        # Update User fields if present
        user = instance.user
        if 'email' in validated_data:
            user.email = validated_data.pop('email')
        if 'name' in validated_data:
            name = validated_data.pop('name')
            name_parts = name.split()
            instance.user.first_name = name_parts[0] if name_parts else ''
            instance.user.last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            instance.user.save()
        if 'role' in validated_data:
            user.role = validated_data.pop('role')
        user.save()
            
        # Update Employee fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance