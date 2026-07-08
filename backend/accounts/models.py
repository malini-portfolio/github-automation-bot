from django.db import models


class GitHubUser(models.Model):

    github_id = models.BigIntegerField(unique=True)

    username = models.CharField(max_length=200)

    name = models.CharField(max_length=255, blank=True, null=True)

    email = models.EmailField(blank=True, null=True)

    avatar_url = models.URLField(blank=True, null=True)

    access_token = models.TextField()

    profile_url = models.URLField(blank=True, null=True)

    public_repos = models.IntegerField(default=0)

    followers = models.IntegerField(default=0)

    following = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username