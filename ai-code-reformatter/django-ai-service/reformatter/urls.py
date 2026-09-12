from django.urls import path
from . import views

urlpatterns = [
    path('reformat/', views.reformat_code, name='reformat'),
    path('health/', views.health_check, name='health'),
]