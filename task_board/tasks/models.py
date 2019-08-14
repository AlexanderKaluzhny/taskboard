from enum import IntEnum
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from task_board.users.models import User


class TaskStatuses(object):
    NOT_DONE = 0
    DONE = 1

    @classmethod
    def as_choices(cls):
        return (
            (cls.NOT_DONE, "Not done"),
            (cls.DONE, "Done")
        )


class TaskQuerySet(models.QuerySet):
    def not_done(self):
        return self.filter(status=TaskStatuses.NOT_DONE)


class Task(models.Model):
    name = models.CharField(_("Name"), max_length=80, blank=False)
    description = models.TextField(_("Description"), blank=False)
    status = models.SmallIntegerField(choices=TaskStatuses.as_choices(), default=TaskStatuses.NOT_DONE)
    modified_on = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='tasks', null=False, on_delete=models.CASCADE)
    accomplished_by = models.ForeignKey(User, related_name='accomplished_tasks', null=True, on_delete=models.CASCADE)

    objects = TaskQuerySet.as_manager()

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        ordering = ['-modified_on']

    def save(self, *args, **kwargs):
        if self.status == TaskStatuses.NOT_DONE:
            self.accomplished_by = None

        super(Task, self).save(*args, **kwargs)

    def clean(self):
        # make sure accomplished_by field is set on setting of status to \'Done\'
        if self.status == TaskStatuses.DONE and self.accomplished_by == None:
            raise ValidationError('accomplished_by field should be set on setting of status to \'Done\'')
