import json

from test_plus.test import TestCase

from rest_framework.test import APIRequestFactory
from rest_framework import status

from task_board.api.tasks.endpoints import TaskUpdateDeleteView, TaskListView
from task_board.users.tests.factories import UserFactory
from task_board.tasks import utils
from task_board.tasks.models import Task, TaskStatuses

factory = APIRequestFactory()


class TestTaskUpdateDeleteView(TestCase):
    def setUp(self):
        self.user = UserFactory()
        utils.create_sample_tasks(self.user)

        self.view = TaskUpdateDeleteView.as_view()

    def test_login_required(self):
        obj = Task.objects.filter(created_by=self.user).first()

        response = self.patch('api-v1:task-update-delete', pk=obj.pk, data={})
        self.response_302()
        response = self.delete('api-v1:task-update-delete', pk=obj.pk)
        self.response_302()
        self.assertLoginRequired('api-v1:task-list')

    def test_update_accomplished_by_is_empty(self):
        # make sure the accomplished_by field remains empty on setting of status 'not done'
        obj = Task.objects.filter(created_by=self.user).first()
        obj.status = TaskStatuses.DONE
        obj.accomplished_by = self.user
        obj.save()

        json_data = json.dumps({
            'status': TaskStatuses.NOT_DONE,
        })

        # compose the patch request, get response
        url = self.reverse('api-v1:task-update-delete', pk=obj.pk)
        request = factory.patch(url, data=json_data, content_type='application/json')
        request.user = self.user
        response = self.view(request, pk=obj.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_obj = Task.objects.get(pk=obj.pk)
        self.assertTrue(result_obj.status is TaskStatuses.NOT_DONE)
        self.assertTrue(result_obj.accomplished_by is None)

    def test_update_accomplished_by_is_set(self):
        # make sure the accomplished_by field is set on setting of status to 'Done'

        obj = Task.objects.filter(created_by=self.user).first()
        self.assertTrue(obj.status is TaskStatuses.NOT_DONE)
        self.assertTrue(obj.accomplished_by is None)

        json_data = json.dumps({
            'status': TaskStatuses.DONE,
        })

        # compose the patch request, get response
        url = self.reverse('api-v1:task-update-delete', pk=obj.pk)
        request = factory.patch(url, data=json_data, content_type='application/json')
        request.user = self.user
        response = self.view(request, pk=obj.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_obj = Task.objects.get(pk=obj.pk)
        self.assertTrue(result_obj.status is TaskStatuses.DONE)
        self.assertTrue(result_obj.accomplished_by == self.user)


class TestCreateTaskView(TestCase):
    def setUp(self):
        self.user = UserFactory()
        utils.create_sample_tasks(self.user)

        self.view = TaskListView.as_view()

    def test_create_task(self):
        # make sure task is created

        task_data = dict(
            status=TaskStatuses.DONE,
            name='sample task',
            description='sample description',
        )
        json_data = json.dumps(task_data)

        # compose the post request, get response
        url = self.reverse('api-v1:task-list')
        request = factory.post(url, data=json_data, content_type='application/json')
        request.user = self.user
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['created_by'], self.user.pk)

        for k, v in task_data.items():
            self.assertEqual(response.data[k], task_data[k])
