from django.forms import ModelForm

from crispy_forms.helper import FormHelper

from task_board.tasks.models import Task


class TaskForm(ModelForm):

    class Meta:
        model = Task
        fields = ['name', 'description', 'status']


    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
