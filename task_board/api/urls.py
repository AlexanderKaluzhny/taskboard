from django.conf.urls import url, include

from task_board.api.tasks import views

app_name = 'api-v1'

urlpatterns = [
    url(r'^old-view/$', views.TaskListView.as_view(), name='task-list'),
    url(r'^tasks/$', views.TaskCreateView.as_view(), name='task-create'),
    url(r'^tasks/(?P<pk>\d+)/$', views.TaskUpdateDeleteView.as_view(), name='task-update-delete'),
]
