from rest_framework import serializers

from task_board.tasks.models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_by_username = serializers.StringRelatedField(source='created_by')
    accomplished_by_username = serializers.StringRelatedField(source='accomplished_by')

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'status',
                  'created_by', 'created_by_username',
                  'accomplished_by', 'accomplished_by_username']
