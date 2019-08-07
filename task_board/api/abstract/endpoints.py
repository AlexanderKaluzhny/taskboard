from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from braces.views import LoginRequiredMixin


class TaskBoardEndpoint(LoginRequiredMixin, APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated,)
