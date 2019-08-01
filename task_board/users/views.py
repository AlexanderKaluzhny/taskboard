# -*- coding: utf-8 -*-
import random

from django.http import HttpResponseBadRequest, HttpResponseRedirect, HttpResponseForbidden
from django.urls import reverse
from django.views.generic import View, DetailView, ListView, RedirectView, UpdateView

from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

from allauth.account.forms import LoginForm
from allauth.exceptions import ImmediateHttpResponse

from .models import User
from deployment.demo import demo_users


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse('users:detail',
                       kwargs={'username': self.request.user.username})


class UserUpdateView(LoginRequiredMixin, UpdateView):
    fields = ['name', ]

    # we already imported User in the view code above, remember?
    model = User

    # send the user back to their own page after a successful update
    def get_success_url(self):
        return reverse('users:detail',
                       kwargs={'username': self.request.user.username})

    def get_object(self):
        # Only get the User record for the user making the request
        return User.objects.get(username=self.request.user.username)


class UserListView(LoginRequiredMixin, ListView):
    model = User
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'


class DemoUserLoginView(View):
    def get(self, request, *args, **kwargs):
        if not len(demo_users):
            return HttpResponseBadRequest()

        user_seq_numb = random.randint(0, len(demo_users) - 1)
        username = demo_users[user_seq_numb]
        password = 'password'

        if not User.objects.filter(username=username).exists():
            from deployment.demo import _create_user
            _create_user(username)

        data = {
            'login': username,
            'password': password,
        }
        form = LoginForm(request=request, data=data)
        if form.is_valid():
            try:
                return form.login(self.request, redirect_url='/')
            except ImmediateHttpResponse as e:
                return e.response
        else:
            response = HttpResponseBadRequest()

        return response
