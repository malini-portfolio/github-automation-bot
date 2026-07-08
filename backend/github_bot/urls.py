from django.urls import path
from .views import repositories

urlpatterns = [
    path(
        "repositories/",
        repositories
    ),
    
]