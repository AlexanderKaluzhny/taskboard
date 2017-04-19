from rest_framework import serializers

from task_board.tasks.models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_by_username = serializers.StringRelatedField(source='created_by')
    accomplished_by_username = serializers.StringRelatedField(source='accomplished_by')
    status_readable = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'status',
                  'created_by', 'created_by_username',
                  'accomplished_by', 'accomplished_by_username',
                  'status_readable']


    def __init__(self, *args, **kwargs):
        if 'data' in kwargs and 'context' in kwargs and 'request' in kwargs['context']:
            request = kwargs['context']['request']
            data = kwargs['data']
            if 'status' in data and str(data['status']) == str(Task.STATUS_DONE):
                data = kwargs['data'].copy()
                data.update({'accomplished_by': request.user.pk})
                kwargs['data'] = data

        super(TaskSerializer, self).__init__(*args, **kwargs)
