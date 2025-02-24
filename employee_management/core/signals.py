from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Department, Employee

@receiver([post_save, post_delete], sender=Department)
def update_department_count(sender, instance, **kwargs):
    # Update the company's department count
    company = instance.company
    company.refresh_from_db()  # Refresh to ensure we have latest data
    # The count is calculated automatically via the property in the Company model

@receiver([post_save, post_delete], sender=Employee)
def update_employee_count(sender, instance, **kwargs):
    # Update the company's employee count
    company = instance.company
    company.refresh_from_db()  # Refresh to ensure we have latest data
    # The count is calculated automatically via the property in the Company model