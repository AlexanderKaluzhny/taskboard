# -*- coding: utf-8 -*-
from django.contrib.auth.models import AbstractUser
from django.urls import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_('Name of User'), blank=True, max_length=255)

    def __str__(self):
        return self.username

    @property
    def fullname(self):
        return f'{self.first_name} {self.last_name}' if self.first_name or self.last_name else ''

    def get_absolute_url(self):
        return reverse('users:detail', kwargs={'username': self.username})
