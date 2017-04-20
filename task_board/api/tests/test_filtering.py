from test_plus.test import TestCase

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

from django.utils.http import urlencode


from task_board.api.tasks.views import TaskListView
from task_board.api.tasks.filtering import CheckboxExcludeDoneTasks, DoneTaskFilterManager

from task_board.tasks.models import Task
from task_board.tasks.utils import create_sample_tasks
from task_board.users.tests.factories import UserFactory


factory = APIRequestFactory()


def create_view_and_GET_request(query_params):
    query_params_encoded = urlencode(query_params)
    request = Request(factory.get('/', query_params))
    view = TaskListView
    view.request = request
    return view, query_params_encoded


class TestCheckboxExcludeDoneTasks(TestCase):

    def setUp(self):
        query_params = {
            'name': 'abcde',
            'someparam': 'somevalue',
        }
        self.view, self.query_params_encoded = create_view_and_GET_request(query_params)

    def test_set_checked(self):
        checkbox = CheckboxExcludeDoneTasks()

        with self.assertRaises(Exception):
            # make sure it raises exception when attribute is requested before being set.
            checkbox.is_checked()

        checkbox.set_checked(True, self.view)
        self.assertTrue(checkbox.is_checked)
        self.assertNotIn('exclude_done', checkbox.url)

        checkbox.set_checked(False, self.view)
        self.assertFalse(checkbox.is_checked)
        self.assertIn('exclude_done', checkbox.url)

    def test_build_url_for_checked_state(self):
        # make sure the url is for getting the list that includes 'done' tasks
        checkbox = CheckboxExcludeDoneTasks()
        url = checkbox.build_url(self.view, is_checked=True)
        self.assertNotIn('exclude_done', url)
        # make sure other params are preserved
        self.assertTrue(self.query_params_encoded in url)

        # make sure the 'exclude_done' is removed from the url when is_checked
        view, _ = create_view_and_GET_request(dict(exclude_done='true'))
        url = checkbox.build_url(view, is_checked=True)
        self.assertNotIn('exclude_done', url)

    def test_build_url_for_not_checked_state(self):
        checkbox = CheckboxExcludeDoneTasks()
        url = checkbox.build_url(self.view, is_checked=False)
        self.assertTrue('exclude_done' in url)
        self.assertTrue(self.query_params_encoded in url)

    def test_build_url__page_param_removed(self):
        # make sure the 'page' query param is removed when we build the url
        query_params = {
            'name': 'abcde',
            'someparam': 'somevalue',
            TaskListView.pagination_class.page_query_param: 3,
        }
        view, query_params_encoded = create_view_and_GET_request(query_params)

        checkbox = CheckboxExcludeDoneTasks()
        url = checkbox.build_url(self.view, is_checked=False)
        self.assertNotIn(view.pagination_class.page_query_param, url)
        url = checkbox.build_url(self.view, is_checked=True)
        self.assertNotIn(view.pagination_class.page_query_param, url)
        self.assertNotIn('exclude_done', url)


class TestDoneFilterManager(TestCase):

    def setUp(self):
        self.user = UserFactory()
        create_sample_tasks(self.user)
        pks = Task.objects.values_list('id', flat=True)[:3]
        done_tasks = Task.objects.filter(pk__in=pks)
        done_tasks.update(status=Task.STATUS_DONE, accomplished_by=self.user)
        self.done_task_pks = pks

    def test_status_filter_param(self):
        done_filter_manager = DoneTaskFilterManager()
        query_params = {
            'status': Task.STATUSES[1][1], # 'Done'
            'exclude_done': 'true'
        }
        view, query_params_encoded = create_view_and_GET_request(query_params)

        # make sure the DoneTaskFilterManager doesn't filter 'Done' items when there is a 'status' query param,
        # so the input queryset doesn't change.
        qs = Task.objects.all()
        filtered_queryset = done_filter_manager.filter_queryset(view.request, qs, view)
        expected_len = Task.objects.count()
        self.assertTrue(expected_len == filtered_queryset.count())

        # make sure the checkbox is not shown when there is a 'status' param set.
        self.assertTrue(done_filter_manager.checkbox.is_shown == False)

        # make sure, the qs is not filtered when the 'exclude_done' query param is not set
        query_params = {
        }
        view, query_params_encoded = create_view_and_GET_request(query_params)
        filtered_queryset = done_filter_manager.filter_queryset(view.request, qs, view)
        expected_len = Task.objects.count()
        self.assertTrue(expected_len == filtered_queryset.count())
        self.assertTrue(done_filter_manager.checkbox.is_checked == False)

    def test_status_filtering(self):
        # make sure the 'Done' tasks are filtered from queryset

        done_filter_manager = DoneTaskFilterManager()
        query_params = {
            'exclude_done': 'true'
        }
        view, query_params_encoded = create_view_and_GET_request(query_params)
        qs = Task.objects.all()

        filtered_queryset = done_filter_manager.filter_queryset(view.request, qs, view)
        expected_len = Task.objects.count() - len(self.done_task_pks)
        self.assertTrue(expected_len == filtered_queryset.count())

        # check 'done' pks are not in the list
        qs_pks = filtered_queryset.values_list('pk', flat=True)
        self.assertTrue(len(set(qs_pks) & set(self.done_task_pks)) == 0)
