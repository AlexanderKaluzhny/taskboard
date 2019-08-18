import requests
import logging

from urllib.parse import urlunparse, urlparse

from django import http
from django.conf import settings
from django.template import engines
from django.views.generic import TemplateView

from braces.views import LoginRequiredMixin


logger = logging.getLogger('general')


class TasksBoardIndexView(LoginRequiredMixin, TemplateView):
    """
    View that renders React App.
    """
    template_name = 'index.html'
    react_upstream = 'http://localhost:3000'
    cut_part = None

    def get(self, request, *args, **kwargs):
        if not settings.DEBUG:
            # just serve index.html because in production it has the reactjs scripts embedded.
            return super().get(request, *args, **kwargs)

        url = request.path
        upstream_url = self.react_upstream + url
        logger.debug(f'Proxying request to: {upstream_url}')

        response = requests.get(upstream_url, stream=True)
        content_type = response.headers.get('Content-Type')
        logger.debug(f'Response from {upstream_url}: {response}, {content_type}')

        if content_type == 'text/html; charset=UTF-8':
            context = self.get_context_data(**kwargs)
            return http.HttpResponse(
                content=engines['django'].from_string(response.text).render(context),
                status=response.status_code,
                reason=response.reason,
            )
        else:
            return http.StreamingHttpResponse(
                streaming_content=response.iter_content(2 ** 12),
                content_type=content_type,
                status=response.status_code,
                reason=response.reason,
            )

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['request'] = self.request
        return ctx
