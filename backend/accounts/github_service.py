import os
import requests


def exchange_code_for_token(code):
    """
    Exchange GitHub authorization code for an access token.
    """

    url = "https://github.com/login/oauth/access_token"

    payload = {
        "client_id": os.getenv("GITHUB_CLIENT_ID"),
        "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
        "code": code,
        "redirect_uri": os.getenv("GITHUB_REDIRECT_URI"),
    }

    headers = {
        "Accept": "application/json"
    }

    response = requests.post(url, data=payload, headers=headers)

    return response.json()
def get_github_user(access_token):
    """
    Fetch logged-in user's GitHub profile.
    """

    url = "https://api.github.com/user"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    }

    response = requests.get(url, headers=headers)

    return response.json()
def get_user_repositories(access_token):
    url = "https://api.github.com/user/repos"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json"
    }

    response = requests.get(url, headers=headers)

    return response.json()
def create_webhook(
    owner,
    repo,
    access_token,
    webhook_url
):
    url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/hooks"
    )

    payload = {
        "name": "web",

        "active": True,

        "events": [
            "push",
            "pull_request",
            "issues"
        ],

        "config": {
            "url": webhook_url,
            "content_type": "json"
        }
    }

    headers = {
        "Authorization":
            f"Bearer {access_token}",

        "Accept":
            "application/vnd.github+json"
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers
    )

    return response.json()