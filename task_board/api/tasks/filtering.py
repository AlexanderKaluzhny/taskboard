from django.utils.functional import cached_property
from task_board.tasks.models import Task


class CheckboxExcludeDoneTasks(object):
    """ Manages the checkbox to turn on/off the done tasks filter.
        Provides an url for listing in on or off states.
    """
    @property
    def url(self):
        url = getattr(self, '_url', '')
        assert len(url), "url for getting of queryset that excludes Done tasks is not evaluated."
        return url

    @property
    def is_checked(self):
        if not getattr(self, 'is_shown', True):
            # if the checkbox is not shown, we set the checked state to False.
            return False

        is_checked = getattr(self, '_is_checked', None)
        assert is_checked is not None, "checked attribute is not set, yet."
        return is_checked

    def set_checked(self, value, view):
        self._is_checked = value
        self._url = self.build_url(view, is_checked=value)

    @classmethod
    def build_url(self, view, is_checked=False):
        """ Build url to be able to get queryset excluding done tasks
            If not checked - we are building a link where it is checked
        """

        from django.http.request import iri_to_uri

        full_path = view.request._request.get_full_path()
        current_query_params = view.request.query_params.copy()
        # strip query params from full_path
        full_path_no_params = full_path.split("?")[0]

        # remove pagination param from query params
        page_num = None
        if view.pagination_class and current_query_params.get(view.pagination_class.page_query_param, None):
            page_num = current_query_params.pop(view.pagination_class.page_query_param)

        # if it is not checked now - we are building a link where it is checked
        if not is_checked:
            current_query_params['exclude_done'] = 'true'
        elif 'exclude_done' in current_query_params:
            current_query_params.pop('exclude_done')

        query_params_urlencoded = current_query_params.urlencode()

        output_full_path = '%s%s' % (
            full_path_no_params,
            ('?' + iri_to_uri(query_params_urlencoded)) if query_params_urlencoded else ''
        )
        return output_full_path


class DoneTaskFilterManager(object):
    """ Manages the rating logic for RssNotifications """

    @cached_property
    def checkbox(self):
        # checkbox to turn on/off the done tasks filter
        return CheckboxExcludeDoneTasks()

    def filter_queryset(self, request, queryset, view):
        self.checkbox.is_shown = True

        # skip custom filtering of done tasks if explicitly filtered by 'status'
        if 'status' in request.query_params and request.query_params['status'] != '':
            self.checkbox.is_shown = False
            return queryset

        # filter done tasks if '?exclude_done=true' specified
        exclude_done = request.query_params.get('exclude_done', None)
        if exclude_done:
            queryset = Task.objects.not_done(queryset)
            self.checkbox.set_checked(True, view)
            return queryset

        self.checkbox.set_checked(False, view)
        return queryset
