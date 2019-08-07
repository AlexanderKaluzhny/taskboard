from test_plus.test import TestCase

from task_board.tasks.models import Task, TaskStatuses
from task_board.tasks.serializers import TaskSerializer
from task_board.users.tests.factories import UserFactory


class TestTaskSerializer(TestCase):
    def setUp(self):
        self.user = UserFactory()

        self.task_data = dict(
            name='sample task',
            description='sample description',
            status=TaskStatuses.NOT_DONE,
            created_by=self.user,
        )

    def test_required_fields(self):
        task_data = {}
        serializer = TaskSerializer(data=task_data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors.keys())
        self.assertIn('description', serializer.errors.keys())
        self.assertIn('created_by', serializer.errors.keys())

    def test_serializer(self):
        # make sure create instance scenario works well
        task_data = dict(
            name='sample task',
            description='sample description',
            created_by=self.user.pk,
        )

        serializer = TaskSerializer(data=task_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertEqual(instance.created_by.pk, task_data['created_by'])

    def test_accomplished_by_set(self):
        # make sure the accomplished by is set based on the request.user if the status is 'Done'

        task_data = dict(
            name='sample task',
            description='sample description',
            status=TaskStatuses.DONE,
        )

        class MockRequest(object):
            pass

        request = MockRequest()
        request.user = self.user

        context = dict(request=request)

        serializer = TaskSerializer(data=task_data, context=context)
        self.assertEqual(serializer.initial_data['accomplished_by'], self.user.pk)

        task_data['status'] = TaskStatuses.NOT_DONE
        serializer = TaskSerializer(data=task_data, context=context)
        self.assertTrue(not 'accomplished_by' in serializer.initial_data)
