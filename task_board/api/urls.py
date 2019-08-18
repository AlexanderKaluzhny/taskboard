from django.urls import path

from task_board.api.tasks import endpoints
from task_board.api.settings.endpoints import AppGlobalsEndpoint

app_name = 'api-v1'

urlpatterns = [
    path('tasks/', endpoints.TaskListView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', endpoints.TaskUpdateDeleteView.as_view(), name='task-update-delete'),

    path('globals/', AppGlobalsEndpoint.as_view())
]
