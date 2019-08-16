/* eslint-disable react/sort-comp */
import $ from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { TASK_STATUSES } from '../constants';

class ApiRequestor {
  getRequestContext = (method, url, data, onSuccessHandler, onErrorHandler) => ({
    type: method,
    dataType: 'json',
    url,
    data,
    context: this,
    success: (obj, textStatus, jqXHR) => onSuccessHandler(obj),
    error: (xhr, textStatus, error) => onErrorHandler(xhr, textStatus, error),
  });

  post = (url, data, onSuccessHandler, onErrorHandler) => {
    const postContext = this.getRequestContext('POST', url, data, onSuccessHandler, onErrorHandler);
    $.ajax(postContext);
  };

  patch = (url, data, onSuccessHandler, onErrorHandler) => {
    const patchContext = this.getRequestContext('PATCH', url, data, onSuccessHandler, onErrorHandler);
    $.ajax(patchContext);
  };

  delete = (url, onSuccessHandler, onErrorHandler) => {
    const deleteContext = this.getRequestContext('DELETE', url, /* no data */ '', onSuccessHandler, onErrorHandler);
    $.ajax(deleteContext);
  };
}

class TasksStateContainer extends React.Component {
  static propTypes = {
    query: PropTypes.exact({
      searchValue: PropTypes.string.isRequired,
      limit: PropTypes.number.isRequired,
      offset: PropTypes.number.isRequired,
      statusFilter: PropTypes.string.isRequired,
    }).isRequired,
    onTotalNumberReceived: PropTypes.func.isRequired,
  };

  state = {
    isLoaded: false,
    taskList: [],
    currentTotalNumber: 0,
  };

  componentDidMount() {
    this.fetchTasks();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchTasks();
    }
  }

  onEditTask = (taskId, partialData, onSuccess, onError) => {
    const api = new ApiRequestor();
    api.patch(
      `/api/tasks/${taskId}/`,
      partialData,
      (task) => {
        this.onEditSuccess(taskId, task);
        onSuccess(task);
      },
      (xhr, textStatus, error) => {
        this.onRequestError(taskId, xhr.status, error);
        onError(xhr.status, error, xhr.responseJSON);
      },
    );
  };

  onCreateTask = (taskData, onSuccess, onError) => {
    const api = new ApiRequestor();
    api.post(
      '/api/tasks/',
      taskData,
      (task) => {
        this.onCreateSuccess(task);
        onSuccess(task);
      },
      (xhr, textStatus, error) => {
        this.onRequestError(undefined, xhr.status, error);
        onError(xhr.status, error, xhr.responseJSON);
      },
    );
  };

  onDeleteTask = (taskId, onSuccess, onError) => {
    const api = new ApiRequestor();
    api.delete(
      `/api/tasks/${taskId}/`,
      () => {
        this.onDeleteSuccess(taskId);
        onSuccess();
      },
      (xhr, textStatus, error) => {
        this.onRequestError(taskId, xhr.status, error);
        onError(xhr.status, error, xhr.responseJSON.detail);
      },
    );
  };

  onTaskMarkDone = (taskId, onSuccess, onError) => {
    const api = new ApiRequestor();
    api.patch(
      `/api/tasks/${taskId}/`,
      { status: TASK_STATUSES.DONE },
      (task) => {
        this.onTaskMarkDoneSuccess(taskId, task);
        onSuccess(task);
      },
      (xhr, textStatus, error) => {
        this.onRequestError(taskId, xhr.status, error);
        onError(xhr.status, error, xhr.responseJSON);
      },
    );
  }

  getTaskManageFuncs() {
    return {
      onEditTask: this.onEditTask,
      onCreateTask: this.onCreateTask,
      onDeleteTask: this.onDeleteTask,
      onTaskMarkDone: this.onTaskMarkDone,
    };
  }

  getQueryParams() {
    const {
      searchValue, limit, offset, statusFilter,
    } = this.props.query;
    const queryParams = { limit, offset };
    if (statusFilter !== '-1') {
      queryParams.status = statusFilter;
    }
    if (searchValue) {
      queryParams.search = searchValue;
    }

    return queryParams;
  }

  fetchTasks() {
    fetch(`api/tasks/?${qs.stringify(this.getQueryParams())}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState(
            {
              isLoaded: true,
              taskList: result.results,
              currentTotalNumber: result.count,
            },
            () => this.props.onTotalNumberReceived(result.count),
          );
        },
        error => this.setState({ isLoaded: false, error }),
      );
  }

  onEditSuccess = (taskId, serverResponseTask) => {
    const modifiedList = [...this.state.taskList];
    const idx = modifiedList.findIndex(task => task.id === taskId);
    const modifiedTask = modifiedList[idx];

    for (const prop in serverResponseTask) {
      modifiedTask[prop] = serverResponseTask[prop];
    }

    this.setState({ taskList: modifiedList });
  };

  onCreateSuccess = (serverResponseTask) => {
    let modifiedList = [...this.state.taskList];
    modifiedList.unshift(serverResponseTask);
    this.setState({ taskList: modifiedList });
  }

  onDeleteSuccess = (taskId) => {
    let modifiedList = [...this.state.taskList];
    const idx = modifiedList.findIndex(task => task.id === taskId);

    modifiedList.splice(idx, 1);
    this.setState({ taskList: modifiedList });
  }

  onTaskMarkDoneSuccess = (taskId, serverResponseTask) => {
    return this.onEditSuccess(taskId, serverResponseTask);
  }

  onRequestError = (taskId, status, error) => {
    console.log(status, error);
  };

  render() {
    return this.props.children(this.getTaskManageFuncs(), this.state.taskList);
  }
}

export default TasksStateContainer;
