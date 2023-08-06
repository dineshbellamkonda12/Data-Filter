from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get_vehicle_tests/', views.get_vehicle_tests, name='get_vehicle_tests'),
    path('get_all_data/', views.get_all_data, name='get_all_data'),
]
