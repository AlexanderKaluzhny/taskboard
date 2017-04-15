from django.conf.urls import url, include

from task_board.api.tasks import views


urlpatterns = [
    url(r'^$', views.TaskListCreateView.as_view(), name='task-list'),
    url(r'^tasks/(?P<pk>\d+)/$', views.TaskUpdateView.as_view(), name='task-update'),
]
