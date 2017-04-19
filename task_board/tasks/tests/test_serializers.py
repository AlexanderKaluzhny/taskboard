from test_plus.test import TestCase

from task_board.tasks.models import Task
from task_board.tasks.serializers import TaskSerializer
from task_board.users.tests.factories import UserFactory


class TestTaskSerializer(TestCase):
    def setUp(self):
        self.user = UserFactory()

        self.task_data = dict(
            name='sample task',
            description='sample description',
            status=Task.STATUS_DEFAULT,
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
