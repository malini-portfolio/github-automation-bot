from django.urls import path
from .views import github_webhook

urlpatterns = [
    path("", github_webhook, name="github_webhook"),
]