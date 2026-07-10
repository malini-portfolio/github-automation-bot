import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from accounts.models import GitHubUser
from github_bot.models import Repository
from notifications.models import Notification

print("Seeding database...")

# 1. Create a dummy user
user, created = GitHubUser.objects.update_or_create(
    github_id=999999,
    defaults={
        "username": "demo-bot-user",
        "name": "Demo Bot User",
        "email": "demo@example.com",
        "avatar_url": "https://avatars.githubusercontent.com/u/999999?v=4",
        "access_token": "dummy_token_123456",
        "profile_url": "https://github.com/demo-bot-user",
        "public_repos": 3,
        "followers": 150,
        "following": 45,
    }
)
print(f"User created: {user.username}")

# 2. Create some repositories
repos = [
    {
        "repo_id": 101,
        "name": "my-awesome-app",
        "full_name": "demo-bot-user/my-awesome-app",
        "private": False,
        "html_url": "https://github.com/demo-bot-user/my-awesome-app",
        "default_branch": "main",
        "webhook_installed": True,
    },
    {
        "repo_id": 102,
        "name": "secret-recipe-db",
        "full_name": "demo-bot-user/secret-recipe-db",
        "private": True,
        "html_url": "https://github.com/demo-bot-user/secret-recipe-db",
        "default_branch": "master",
        "webhook_installed": False,
    },
    {
        "repo_id": 103,
        "name": "react-github-bot-ui",
        "full_name": "demo-bot-user/react-github-bot-ui",
        "private": False,
        "html_url": "https://github.com/demo-bot-user/react-github-bot-ui",
        "default_branch": "main",
        "webhook_installed": True,
    }
]

for repo_data in repos:
    repo, created = Repository.objects.update_or_create(
        repo_id=repo_data["repo_id"],
        defaults={
            "user": user,
            "name": repo_data["name"],
            "full_name": repo_data["full_name"],
            "private": repo_data["private"],
            "html_url": repo_data["html_url"],
            "default_branch": repo_data["default_branch"],
            "webhook_installed": repo_data["webhook_installed"],
        }
    )
    print(f"Repository created: {repo.full_name}")

# 3. Create some notifications
notifications = [
    {
        "event_type": "push",
        "repository": "demo-bot-user/my-awesome-app",
        "message": "Push event: demo-bot-user pushed 2 commits to main branch.",
    },
    {
        "event_type": "pull_request",
        "repository": "demo-bot-user/react-github-bot-ui",
        "message": "Pull Request opened: #42 'Update dashboard styles' by contributor-alice.",
    },
    {
        "event_type": "issues",
        "repository": "demo-bot-user/my-awesome-app",
        "message": "Issue opened: #15 'Bug: app crashes on login' by user-bob.",
    }
]

# Clean existing notifications to avoid duplication
Notification.objects.all().delete()

for notif_data in notifications:
    notif = Notification.objects.create(
        event_type=notif_data["event_type"],
        repository=notif_data["repository"],
        message=notif_data["message"],
    )
    print(f"Notification created: {notif.message[:40]}...")

print("Database seeding completed successfully!")
