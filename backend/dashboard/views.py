from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(["GET"])
def dashboard(request):
    return Response({
        "message": "Welcome to GitHub Automation Bot",
        "status": "Backend Working"
    })