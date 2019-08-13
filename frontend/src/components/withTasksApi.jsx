import $ from 'jquery';
import React from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

class ApiRequestor {
  getRequestContext = (method, url, data, onSuccessHandler, onErrorHandler) => {
    return {
      "type": method,
      "dataType": "json",
      "url": url,
      "data": data,
      context: this,
      success: (data, textStatus, jqXHR) => onSuccessHandler(data),
      error:  (xhr, textStatus, error) => onErrorHandler(xhr.status, error),
    };
  }

  post = (url, data, onSuccessHandler, onErrorHandler) => {
    var postContext = this.getRequestContext('POST', url, data, onSuccessHandler, onErrorHandler);
    $.ajax(
      postContext
    );
  }

  patch = (url, data, onSuccessHandler, onErrorHandler) => {
    var patchContext = this.getRequestContext('PATCH', url, data, onSuccessHandler, onErrorHandler);
    $.ajax(
      patchContext
    );
  }

  delete = (url, onSuccessHandler, onErrorHandler) => {
    var deleteContext = this.getRequestContext('DELETE', url, /* no data */ '', onSuccessHandler, onErrorHandler);
    $.ajax(
      deleteContext
    );
  }
}

const withTasksApi = (WrappedComponent) => {
  class WithTasksApi extends React.Component {
    onEditTask = (taskId, partialData, onSuccess, onError) => {
      const api = new ApiRequestor();
      api.patch(
        `api/tasks/${taskId}/`,
        partialData,
        (data) => {
          this.onRequestSuccess(data);
          onSuccess(data);
        },
        (status, error) => {
          this.onRequestError(status, error);
          onError(error);
        }
      );
    }

    onRequestSuccess = (data) => {
      console.log(data);
    }

    onRequestError = (status, error) => {
      console.log(status, error);
    }

    render() {
      return (
        <WrappedComponent onEditTask={this.onEditTask} />
      );
    }
  }

  WithTasksApi.displayName = `withTasksApi(${getDisplayName(WrappedComponent)})`;
  return WithTasksApi;
};

export default withTasksApi;
