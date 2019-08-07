from test_plus.test import TestCase

from django.core.exceptions import ValidationError

from task_board.tasks.models import Task
from task_board.users.tests.factories import UserFactory


class TestTaskModel(TestCase):
    def setUp(self):
        self.user = UserFactory()

        self.task_data = dict(
            name='sample task',
            description='sample description',
            status=TaskStatuses.NOT_DONE,
            created_by=self.user,
        )

    def test_save_accomplished_by_is_empty(self):
        task = Task.objects.create(**self.task_data)
        self.assertTrue(task.accomplished_by is None)

        task.status = TaskStatuses.DONE
        task.accomplished_by = self.user
        task.save()

        # make sure the accomplished_by is cleaned up on saving
        task.status = TaskStatuses.NOT_DONE
        task.save()
        self.assertEqual(task.accomplished_by, None)

    def test_clean_raises_on_setting_of_status_done(self):
        # make sure the accomplished_by should be set along with the status
        task = Task.objects.create(**self.task_data)
        task.status = TaskStatuses.DONE
        self.assertRaises(ValidationError, task.clean)
        # now call clean having the accomplished_by set.
        task.status = TaskStatuses.DONE
        task.accomplished_by = self.user
        task.clean()
