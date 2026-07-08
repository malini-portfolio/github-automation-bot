from django.contrib import admin
from .models import GitHubUser


@admin.register(GitHubUser)
class GitHubUserAdmin(admin.ModelAdmin):

    list_display = (
        "username",
        "email",
        "public_repos",
        "followers",
    )

    search_fields = (
        "username",
        "email",
    )