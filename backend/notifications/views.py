from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Notification


@api_view(["GET"])
def notification_list(request):

    notifications = Notification.objects.all().order_by("-created_at")

    data = []

    for notification in notifications:
        data.append({
            "id": notification.id,
            "event_type": notification.event_type,
            "repository": notification.repository,
            "message": notification.message,
            "created_at": notification.created_at,
        })

    return Response(data)