from rest_framework.decorators import api_view
from rest_framework.response import Response
from notifications.models import Notification


@api_view(["POST"])
def github_webhook(request):

    # Get event type from GitHub header
    event = request.headers.get("X-GitHub-Event")

    # Get full payload
    payload = request.data

    # Extract repository name
    repository = payload.get(
        "repository",
        {}
    ).get(
        "full_name",
        "Unknown Repository"
    )

    # Create message
    message = f"{event} event occurred in {repository}"

    # Save notification in database
    Notification.objects.create(
        event_type=event,
        repository=repository,
        message=message
    )

    print("===================================")
    print(message)
    print("===================================")

    return Response({
        "status": "success"
    })