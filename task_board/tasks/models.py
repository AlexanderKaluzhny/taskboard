from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import python_2_unicode_compatible

from task_board.users.models import User


@python_2_unicode_compatible
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

    created_by = models.ForeignKey(User, related_name='tasks', null=False)
    accomplished_by = models.ForeignKey(User, related_name='accomplished_tasks', null=True)

    def __str__(self):
        return '%s' % (self.name)

    class Meta:
        ordering = ['-modified_on']

    def save(self, *args, **kwargs):
        if self.status == Task.STATUS_DEFAULT:
            self.accomplished_by = None

        super(Task, self).save(*args, **kwargs)

    # TODO: validate the accomplished_by when status is set
