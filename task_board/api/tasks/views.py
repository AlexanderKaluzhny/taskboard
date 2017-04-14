from braces.views import LoginRequiredMixin

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.generics import ListCreateAPIView, UpdateAPIView
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer, TemplateHTMLRenderer
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters

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


class TaskUpdateView(UpdateAPIView):
    # queryset = Task.objects.all()
    serializer_class = TaskSerializer
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # prefetch the User related information
        return Task.objects.all().select_related()
