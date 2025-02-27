from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsManagerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'manager'

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'manager':
            if hasattr(obj, 'company'):
                return obj.company == request.user.employee.company
            return obj == request.user.employee.company
        return False

class IsEmployeeUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'employee'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user