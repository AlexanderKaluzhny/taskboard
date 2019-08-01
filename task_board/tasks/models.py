from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from task_board.users.models import User


def queryset_exclude_done(qs):
    return qs.exclude(status=Task.STATUS_DONE)


class Task(models.Model):
    STATUS_DEFAULT = 0
    STATUS_DONE = 1

    STATUSES = (
        (STATUS_DEFAULT, "Not done"),
        (STATUS_DONE, "Done")
    )

    name = models.CharField(_("Name"), max_length=80, blank=False)
    description = models.TextField(_("Description"), blank=False)
    status = models.SmallIntegerField(choices=STATUSES, default=STATUS_DEFAULT)
    modified_on = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='tasks', null=False, on_delete=models.CASCADE)
    accomplished_by = models.ForeignKey(User, related_name='accomplished_tasks', null=True, on_delete=models.CASCADE)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        ordering = ['-modified_on']

    def save(self, *args, **kwargs):
        if self.status == Task.STATUS_DEFAULT:
            self.accomplished_by = None

        super(Task, self).save(*args, **kwargs)

    def clean(self):
        # make sure accomplished_by field is set on setting of status to \'Done\'
        if self.status == Task.STATUS_DONE and self.accomplished_by == None:
            raise ValidationError('accomplished_by field should be set on setting of status to \'Done\'')
