from django.db import models
from accounts.models import GitHubUser


class Repository(models.Model):
    user = models.ForeignKey(
        GitHubUser,
        on_delete=models.CASCADE,
        related_name="repositories"
    )

    repo_id = models.BigIntegerField(unique=True)

    name = models.CharField(max_length=255)

    full_name = models.CharField(max_length=255)

    private = models.BooleanField(default=False)

    html_url = models.URLField()

    default_branch = models.CharField(
        max_length=100,
        default="main"
    )

    webhook_installed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name