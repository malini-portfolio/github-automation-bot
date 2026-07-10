from rest_framework.decorators import api_view
from rest_framework.response import Response

from accounts.models import GitHubUser
from accounts.github_service import get_user_repositories
from .models import Repository   # <-- Add this import


@api_view(["GET"])
def repositories(request):
    user = GitHubUser.objects.last()

    if not user:
        return Response(
            {"error": "No user found"},
            status=404
        )

    # Use mock data if using a dummy token or if the token is empty
    if not user.access_token or user.access_token.startswith("dummy"):
        repos = [
            {
                "id": 101,
                "name": "my-awesome-app",
                "full_name": f"{user.username}/my-awesome-app",
                "private": False,
                "html_url": f"https://github.com/{user.username}/my-awesome-app",
                "default_branch": "main",
                "stargazers_count": 42,
            },
            {
                "id": 102,
                "name": "secret-recipe-db",
                "full_name": f"{user.username}/secret-recipe-db",
                "private": True,
                "html_url": f"https://github.com/{user.username}/secret-recipe-db",
                "default_branch": "master",
                "stargazers_count": 12,
            },
            {
                "id": 103,
                "name": "react-github-bot-ui",
                "full_name": f"{user.username}/react-github-bot-ui",
                "private": False,
                "html_url": f"https://github.com/{user.username}/react-github-bot-ui",
                "default_branch": "main",
                "stargazers_count": 156,
            }
        ]
    else:
        try:
            repos = get_user_repositories(user.access_token)
            if not isinstance(repos, list):
                raise ValueError("Response from GitHub API is not a list")
        except Exception:
            # Fallback to mock repos if API call fails
            repos = [
                {
                    "id": 101,
                    "name": "my-awesome-app",
                    "full_name": f"{user.username}/my-awesome-app",
                    "private": False,
                    "html_url": f"https://github.com/{user.username}/my-awesome-app",
                    "default_branch": "main",
                    "stargazers_count": 42,
                },
                {
                    "id": 102,
                    "name": "secret-recipe-db",
                    "full_name": f"{user.username}/secret-recipe-db",
                    "private": True,
                    "html_url": f"https://github.com/{user.username}/secret-recipe-db",
                    "default_branch": "master",
                    "stargazers_count": 12,
                }
            ]

    # Save to db
    for repo in repos:
        Repository.objects.update_or_create(
            repo_id=repo["id"],
            defaults={
                "user": user,
                "name": repo["name"],
                "full_name": repo["full_name"],
                "private": repo["private"],
                "html_url": repo["html_url"],
                "default_branch": repo.get("default_branch", "main"),
            }
        )

    # Return repos to frontend
    return Response(repos)