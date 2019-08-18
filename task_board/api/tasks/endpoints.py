from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import filters
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated, BasePermission

from task_board.tasks.models import Task, TaskStatuses
from task_board.tasks.serializers import TaskSerializer

from task_board.api.abstract.endpoints import TaskBoardEndpoint


class PaginationSettings(LimitOffsetPagination):
    pass


class TaskListView(TaskBoardEndpoint, ListCreateAPIView):
    serializer_class = TaskSerializer
    pagination_class = PaginationSettings

    renderer_classes = (JSONRenderer, BrowsableAPIRenderer,)
    permission_classes = (IsAuthenticated,)

    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    search_fields = {
        'name': ['icontains'],
        'description': ['icontains'],
    }
    filter_fields = ['status']

    def get_queryset(self):
        # prefetch the User related information
        return Task.objects.all().select_related('created_by', 'accomplished_by')

    def create(self, request, *args, **kwargs):
        # add created_by user to the request.data
        create_data = request.data.copy()
        if not 'created_by' in create_data:
            create_data['created_by'] = request.user.pk

        serializer = self.get_serializer(data=create_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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

                if 'status' in request.data.keys() and str(request.data['status']) != str(TaskStatuses.DONE):
                    self.message = 'the status can only be set to \'Done\' for not a task owner.'
                    return False

        return True


class TaskUpdateDeleteView(TaskBoardEndpoint, RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    renderer_classes = (JSONRenderer, BrowsableAPIRenderer,)
    permission_classes = (IsAuthenticated, IsTaskOwnerOrMarkDoneOnly,)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def get_queryset(self):
        # prefetch the User related information
        return Task.objects.all().select_related()
