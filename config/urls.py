# -*- coding: utf-8 -*-
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from django.views import defaults as default_views

from task_board.api import urls as api_urls


urlpatterns = [
    url(r'^', include(api_urls, namespace='api-v1')),
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='frontend-index'),
    url(r'^about/$', TemplateView.as_view(template_name='pages/about.html'), name='about'),

    url(settings.ADMIN_URL, admin.site.urls),

    url(r'^users/', include('task_board.users.urls', namespace='users')),
    url(r'^accounts/', include('allauth.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += [
        url(r'^400/$', default_views.bad_request, kwargs={'exception': Exception('Bad Request!')}),
        url(r'^403/$', default_views.permission_denied, kwargs={'exception': Exception('Permission Denied')}),
        url(r'^404/$', default_views.page_not_found, kwargs={'exception': Exception('Page not Found')}),
        url(r'^500/$', default_views.server_error),
    ]
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns += [
            url(r'^__debug__/', include(debug_toolbar.urls)),
        ]
