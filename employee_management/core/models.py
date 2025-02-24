from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import EmailValidator, RegexValidator
from datetime import date

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    ROLES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='employee')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    @property
    def number_of_departments(self):
        return self.departments.count()
    
    @property
    def number_of_employees(self):
        return Employee.objects.filter(department__company=self).count()
    def __str__(self):
        return self.name

class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    
    @property
    def number_of_employees(self):
        return self.employees.count()

    class Meta:
        unique_together = ['company', 'name']
    def __str__(self):
        return self.name    

class Employee(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    name = models.CharField(max_length=100)
    mobile_number = models.CharField(
        max_length=11,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$')]
    )
    address = models.TextField()
    designation = models.CharField(max_length=100)
    hired_on = models.DateField(null=True, blank=True)
    
    @property
    def days_employed(self):
        if self.hired_on:
            return (date.today() - self.hired_on).days
        return 0
    def __str__(self):
        return self.name
