from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import mixins
from rest_framework.generics import ListCreateAPIView, UpdateAPIView
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer, TemplateHTMLRenderer
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, BasePermission

from braces.views import LoginRequiredMixin

from task_board.tasks.models import Task
from task_board.tasks.forms import TaskForm
from task_board.tasks.serializers import TaskSerializer


class TemplateHTMLRendererBase(TemplateHTMLRenderer):
    """ Base class that converts the context into a dict """

    def _convert_context_into_dict(self, context):
        if not 'results' in context and not isinstance(context, dict):
            context = dict(
                results=context
            )
        return context

    def get_template_context(self, data, renderer_context):
        # NOTE: the data input argument should be a dictionary, according
        # to parent get_template_context()
        # The pagination of view translates the queryset into a dict.

        context = super(TemplateHTMLRendererBase, self).get_template_context(data, renderer_context)

        context = self._convert_context_into_dict(context)
        return context


class ListViewTemplateRenderer(TemplateHTMLRendererBase, BrowsableAPIRenderer):
    """ Renders the list of Tasks into an html. Supports searching. """

    template_name = 'tasks/tasks_api_list.html'

    def get_template_context(self, data, renderer_context):
        view = renderer_context['view']
        request = renderer_context['request']
        response = renderer_context['response']

        context = super(ListViewTemplateRenderer, self).get_template_context(data, renderer_context)

        if getattr(view, 'paginator', None) and view.paginator.display_page_controls:
            paginator = view.paginator
        else:
            paginator = None

        context['paginator'] = paginator
        context['filter_form'] = self.get_filter_form(data, view, request)
        context['user'] = request.user
        context['task_editing_form'] = TaskForm()

        return context


class PaginationSettings(PageNumberPagination):
    page_size = 10


class TaskListCreateView(LoginRequiredMixin, ListCreateAPIView):
    serializer_class = TaskSerializer
    pagination_class = PaginationSettings

    renderer_classes = (ListViewTemplateRenderer, JSONRenderer, BrowsableAPIRenderer,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    search_fields = ['name', 'description']
    filter_fields = ['status']

    def get_queryset(self):
        # prefetch the User related information
        return Task.objects.all().select_related()


class IsTaskOwnerOrMarkDoneOnly(BasePermission):
    """
    Permission class imposing the rules:
    Edit: task name, description and status - allowed only for task owner
    Mark Done: changing the status of a task to "done" - allowed for everyone.
    Delete: deleting a task (allowed only for task owner)
    """

    owner_allowed_fields = ['name', 'description', 'status']
    everybody_allowed_fields = ['status']

    def _is_delete_forbidden(self, request, obj):
        if request.method.upper() == 'DELETE' and (not request.user == obj.created_by):
            self.message = 'Delete is allowed for task owner only.'
            return True

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if self._is_delete_forbidden(request, obj):
            return False

        if request.method.upper() == 'PATCH':
            updated_fields = set(request.data.keys())
            updated_fields.discard('csrfmiddlewaretoken')

            if request.user == obj.created_by:
                # the owner is allowed to update only the allowed_fields
                allowed_fields = set(self.owner_allowed_fields)
                if len(updated_fields) and not updated_fields.issubset(allowed_fields):
                    self.message = 'Owner is allowed to update only %s fields' % (','.join(self.owner_allowed_fields))
                    return False
            else:
                # for everybody else the field set is restricted to status only
                everybody_allowed = set(self.everybody_allowed_fields)
                if not len(updated_fields) \
                    or not updated_fields.issubset(everybody_allowed):
                    self.message = 'It is possible to update only the %s field for not a task owner.' % (
                        ''.join(self.everybody_allowed_fields))
                    return False

                if 'status' in request.data.keys() and str(request.data['status']) != str(Task.STATUS_DONE):
                    self.message = 'the status can only be set to \'Done\' for not a task owner.'
                    return False

        return True


class TaskUpdateDeleteView(mixins.DestroyModelMixin, UpdateAPIView):
    # queryset = Task.objects.all()
    serializer_class = TaskSerializer
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated, IsTaskOwnerOrMarkDoneOnly,)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # TODO: tests, make sure the accomplished by is specified on setting of status
        # specify the user who accomplished the task if the status 'done' is set
        if ('status' in request.data.keys()
            and str(request.data['status']) == str(Task.STATUS_DONE)):
            data['accomplished_by'] = request.user.pk

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def get_queryset(self):
        # prefetch the User related information
        return Task.objects.all().select_related()
