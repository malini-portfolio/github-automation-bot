from django.db import models
from github_bot.models import Repository


class AutomationRule(models.Model):
    EVENT_CHOICES = [
        ("push", "Push"),
        ("pull_request", "Pull Request"),
        ("issues", "Issue"),
    ]

    ACTION_CHOICES = [
        ("notification", "Create Notification"),
        ("log", "Save Log"),
    ]

    repository = models.ForeignKey(
        Repository,
        on_delete=models.CASCADE
    )

    event_type = models.CharField(
        max_length=50,
        choices=EVENT_CHOICES
    )

    action_type = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES
    )

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.repository.name} - {self.event_type}"