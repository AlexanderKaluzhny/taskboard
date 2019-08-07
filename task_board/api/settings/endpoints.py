from rest_framework.response import Response
from task_board.api.abstract.endpoints import TaskBoardEndpoint
from task_board.tasks.models import Task


class AppGlobalsEndpoint(TaskBoardEndpoint):

    def get(self, request, *args, **kwargs):
        return Response(dict(
            tasks_total=Task.objects.count(),
            current_user=request.user.pk
        ))
