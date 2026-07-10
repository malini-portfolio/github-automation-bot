import os
from django.http import JsonResponse
from .github_service import exchange_code_for_token, get_github_user
from django.shortcuts import redirect
from .models import GitHubUser
from accounts.github_service import (
    create_webhook
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from github_bot.models import Repository


def github_login(request):
    print("GitHub Login Called")
    github_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={os.getenv('GITHUB_CLIENT_ID')}"
        f"&redirect_uri={os.getenv('GITHUB_REDIRECT_URI')}"
        "&scope=repo,user"
    )
    print(github_url)

    return redirect(github_url)


def github_callback(request):

    code = request.GET.get("code")

    if not code:
        return JsonResponse(
            {"error": "Authorization code not received"},
            status=400
        )

    token_response = exchange_code_for_token(code)

    access_token = token_response.get("access_token")

    if not access_token:
        return JsonResponse(
            {
                "error": "Access token not received",
                "details": token_response
            },
            status=400
        )

    github_user = get_github_user(access_token)
    print(github_user)
    user, created = GitHubUser.objects.update_or_create(
        
    github_id=github_user["id"],

    defaults={

        "username": github_user["login"],

        "name": github_user.get("name") or github_user.get("login"),

        "email": github_user.get("email"),

        "avatar_url": github_user.get("avatar_url"),

        "profile_url": github_user.get("html_url"),

        "public_repos": github_user.get("public_repos", 0),

        "followers": github_user.get("followers", 0),

        "following": github_user.get("following", 0),

        "access_token": access_token,
    },
)

    return JsonResponse({

    "message": "Login Successful",

    "user": {

        "username": user.username,

        "name": user.name,

        "email": user.email,

        "avatar": user.avatar_url,

        "repositories": user.public_repos
    }
})


def profile(request):

    user = GitHubUser.objects.last()

    if not user:
        return JsonResponse(
            {"error": "No user found"},
            status=404
        )

    return JsonResponse({

        "username": user.username,

        "name": user.name,

        "email": user.email,

        "avatar": user.avatar_url,

        "repositories": user.public_repos,

        "followers": user.followers,

        "following": user.following
    })
@api_view(["POST"])
def connect_repository(request):
    repo_id = request.data.get("repo_id")
    try:
        repo = Repository.objects.get(repo_id=repo_id)
    except Repository.DoesNotExist:
        return Response({"error": "Repository not found"}, status=404)

    if not repo.user.access_token or repo.user.access_token.startswith("dummy"):
        response = {"message": "Mock webhook toggled successfully"}
    else:
        try:
            webhook_url = "https://YOUR_NGROK_URL/api/webhook/"
            response = create_webhook(
                repo.user.username,
                repo.name,
                repo.user.access_token,
                webhook_url
            )
        except Exception as e:
            response = {"message": f"Webhook toggled (GitHub connection error: {str(e)})"}

    repo.webhook_installed = not repo.webhook_installed
    repo.save()

    return Response({
        "status": "success",
        "webhook_installed": repo.webhook_installed,
        "details": response
    })