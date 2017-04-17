import json

from test_plus.test import TestCase

from rest_framework.test import APIRequestFactory
from rest_framework import status

from task_board.api.tasks.views import TaskUpdateDeleteView, IsTaskOwnerOrMarkDoneOnly
from task_board.users.tests.factories import UserFactory
from task_board.tasks import utils
from task_board.tasks.models import Task

factory = APIRequestFactory()


class TestTaskUpdateDeleteView(TestCase):
    def setUp(self):
        self.user = UserFactory()
        utils.create_sample_tasks(self.user)

        self.view = TaskUpdateDeleteView.as_view()

    def test_login_required(self):
        obj = Task.objects.filter(created_by=self.user).first()

        response = self.patch('api-v1:task-update-delete', pk=obj.pk, data={})
        self.response_403()
        response = self.delete('api-v1:task-update-delete', pk=obj.pk)
        self.response_403()
        self.assertLoginRequired('api-v1:task-list')

    def test_update_accomplished_by_is_empty(self):
        # make sure the accomplished_by field remains empty on setting of status 'not done'
        obj = Task.objects.filter(created_by=self.user).first()
        obj.status = Task.STATUS_DONE
        obj.accomplished_by = self.user
        obj.save()

        json_data = json.dumps({
            'status': Task.STATUS_DEFAULT,
        })

        # compose the patch request, get response
        url = self.reverse('api-v1:task-update-delete', pk=obj.pk)
        request = factory.patch(url, data=json_data, content_type='application/json')
        request.user = self.user
        response = self.view(request, pk=obj.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_obj = Task.objects.get(pk=obj.pk)
        self.assertTrue(result_obj.status is Task.STATUS_DEFAULT)
        self.assertTrue(result_obj.accomplished_by is None)

    def test_update_accomplished_by_is_set(self):
        # make sure the accomplished_by field is set on setting of status to 'Done'

        obj = Task.objects.filter(created_by=self.user).first()
        self.assertTrue(obj.status is Task.STATUS_DEFAULT)
        self.assertTrue(obj.accomplished_by is None)

        json_data = json.dumps({
            'status': Task.STATUS_DONE,
        })

        # compose the patch request, get response
        url = self.reverse('api-v1:task-update-delete', pk=obj.pk)
        request = factory.patch(url, data=json_data, content_type='application/json')
        request.user = self.user
        response = self.view(request, pk=obj.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_obj = Task.objects.get(pk=obj.pk)
        self.assertTrue(result_obj.status is Task.STATUS_DONE)
        self.assertTrue(result_obj.accomplished_by == self.user)
