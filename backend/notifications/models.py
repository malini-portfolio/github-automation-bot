from django.db import models


class Notification(models.Model):
    event_type = models.CharField(
        max_length=100
    )

    repository = models.CharField(
        max_length=255
    )

    message = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.message[:50]