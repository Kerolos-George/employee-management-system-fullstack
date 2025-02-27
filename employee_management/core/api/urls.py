from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignInView, 
    CompanyViewSet, 
    DepartmentViewSet, 
    EmployeeViewSet,
    UserProfileView  
)

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')  
router.register(r'departments', DepartmentViewSet, basename='department')  
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('', include(router.urls)),
    path('signin/', SignInView.as_view(), name='signin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),  
]