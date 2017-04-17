$(function() {

  $.ajaxPrefilter(function(settings, originalOptions, xhr) {
    var csrftoken;
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      // Send the token to same-origin, relative URLs only.
      // Send the token only if the method warrants CSRF protection
      // Using the CSRFToken value acquired earlier
      csrftoken = getCookie('csrftoken');
      xhr.setRequestHeader('X-CSRFToken', csrftoken);
    }
  });

  function serializeForm(form) {
    return _.object(_.map(form.serializeArray(), function(item) {
      // Convert object to tuple of (name, value)
      return [item.name, item.value];
    }));
  }

  var TaskRequest = {
    taskSubmitUrl: ['/tasks/', 'TASK ID HERE', '/'],

    composeSubmitUrl: function(task) {
      var url = TaskRequest.taskSubmitUrl;
      url[1] = task.id;
      return url.join('');
    },

    patch: function(url, data, onSuccessHandler, onErrorHandler) {
      $.ajax({
        "type": "PATCH",
        "dataType": "json",
        "url": url,
        "data": data,
        context: this,
        success: $.proxy(this.onRequestSuccess, this, onSuccessHandler),
        error: $.proxy(this.onRequestFailed, this, onErrorHandler),
      });
    },
    delete: function(url, onSuccessHandler, onErrorHandler) {
      $.ajax({
        "type": "DELETE",
        "dataType": "json",
        "url": url,
        context: this,
        success: $.proxy(this.onRequestSuccess, this, onSuccessHandler),
        error: $.proxy(this.onRequestFailed, this, onErrorHandler),
      });
    },

    onRequestSuccess: function(onSuccessHandler, data, textStatus, jqXHR) {
      onSuccessHandler(data);
    },
    onRequestFailed: function(onErrorHandler, xhr, textStatus, error) {
      onErrorHandler(xhr.status, error);
      console.log(error);
    },
  }

  var TaskModalDialogTemplateRenderer = {
    placeToRender: '.task-form-wrapper',

    renderIntoDiv: function(temlateName, templateContext) {
      var formTemplate = $(temlateName);
      var template = _.template(formTemplate.html());
      var html = template(templateContext);
      var newDiv = $("<div></div>", {
        html: html
      });

      return newDiv;
    },

    render: function(temlateName, templateContext) {
      // render task data into template
      var $div = this.renderIntoDiv(temlateName, templateContext);
      $(this.placeToRender).html($div);
      return $div;
    },

    renderIntoPlacehoder: function(placeholder, temlateName, templateContext) {
      var $div = this.renderIntoDiv(temlateName, templateContext);
      $(placeholder).html($div);
    },
  };

  var TaskEditingForm = {
    formTemplate: '#task-editing-form-template',
    formSelector: '#task-editing-form',
    submitButtonSelector: '#submit',
    cancelButtonSelector: '#cancel',

    onTaskEditedResponseSuccess: function(task) {
      // handles editing form server response
      TaskInformationForm.render(task);
      TaskListController.updateTaskRow(task.id, task);
    },
    onTaskEditedResponseError: function(status, error) {
      ServerErrorForm.render(status, error);
    },

    onSubmitForm: function(task, event) {
      // get form data and submit it
      var $form = $(event.currentTarget);
      var form_data = serializeForm($form);
      var url = TaskRequest.composeSubmitUrl(task);
      TaskRequest.patch(url, form_data,
        TaskEditingForm.onTaskEditedResponseSuccess,
        TaskEditingForm.onTaskEditedResponseError
      );

      event.preventDefault();
    },
    onCancelForm: function(task, dismissOnCancel) {
      if (dismissOnCancel) {
        TaskListController.hideModalDialog();
        return;
      }
      TaskInformationForm.render(task);
    },

    assignFormHandlers: function(task, dismissOnCancel) {
      $(this.formSelector).on('submit', $.proxy(this.onSubmitForm, this, task));
      $(this.cancelButtonSelector).click(
        $.proxy(this.onCancelForm, this, task, dismissOnCancel)
      );
    },

    render: function(task, context) {
      var dismissOnCancel = false;
      if (context && 'dismissOnCancel' in context) {
        dismissOnCancel = context.dismissOnCancel;
      }

      TaskModalDialogTemplateRenderer.render(TaskEditingForm.formTemplate, task);
      this.assignFormHandlers(task, dismissOnCancel);
    },
  };

  var TaskInformationForm = {
    taskInformationTemplateName: '#task-information-template',
    controlButtonSelectors: {
      'edit': '#edit-button',
      'delete': '#delete-button',
      'markAsDone': '#markdone-button',
    },

    assignFormHandlers: function(task, $div) {
      // assign Edit button handler of the Task information form
      $div.find('.control-buttons').on('click', this.controlButtonSelectors['edit'],
        $.proxy(TaskEditingForm.render, TaskEditingForm, task));
      $div.find('.control-buttons').on('click', this.controlButtonSelectors['delete'],
        $.proxy(TaskDeleteForm.render, TaskDeleteForm, task));
      $div.find('.control-buttons').on('click', this.controlButtonSelectors['markAsDone'],
        $.proxy(TaskMarkAsDoneForm.render, TaskMarkAsDoneForm, task));
    },

    render: function(task) {
      // render the TaskInformationForm template
      var $renderedDiv = TaskModalDialogTemplateRenderer.render(this.taskInformationTemplateName, task);
      // assign button handlers for rendered fragment
      this.assignFormHandlers(task, $renderedDiv);
    }
  };

  var ServerErrorForm = {
    templateName: '#server-error-template',

    render: function(status, error) {
      TaskModalDialogTemplateRenderer.render(this.templateName, {
        "status": status,
        "error": error,
      });
    },
  }

  var TaskDeleteForm = {
    templateName: '#task-short-info-question-template',

    deleteQuestionPlaceholderSelector: '#task-short-info-question-placeholder',
    deleteQuestionTemplateName: '#task-delete-question-template',
    confirmationTemplateName: '#task-delete-confirmation-template',

    confirmButtonSelector: '#confirm-button',
    cancelButtonSelector: '#cancel-button',

    onTaskDeleteResponseSuccess: function(task) {
      // Task deleted successfully. Render confirmation form.
      // NOTE: task object was bound in the onSubmitDelete
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        this.deleteQuestionPlaceholderSelector,
        this.confirmationTemplateName,
        task
      );
      // delete task row from listing
      TaskListController.deleteTaskRow(task.id);
    },
    onTaskDeleteResponseError: function(status, error) {
      ServerErrorForm.render(status, error);
    },

    onSubmitDelete: function(task, event) {
      var url = TaskRequest.composeSubmitUrl(task);
      TaskRequest.delete(url,
        $.proxy(TaskDeleteForm.onTaskDeleteResponseSuccess, TaskDeleteForm, task),
        TaskDeleteForm.onTaskDeleteResponseError
      );
      event.preventDefault();
    },

    onCancelDelete: function(task, dismissOnCancel) {
      if (dismissOnCancel) {
        TaskListController.hideModalDialog();
        return;
      }

      TaskInformationForm.render(task);
    },

    assignFormHandlers: function(task, dismissOnCancel) {
      // assign delete confirmation button handler
      $(this.confirmButtonSelector).click(
        $.proxy(this.onSubmitDelete, this, task));
      // assign cancel delete button handler
      $(this.cancelButtonSelector).click(
        $.proxy(this.onCancelDelete, this, task, dismissOnCancel)
      );
    },

    render: function(task, context) {
      var dismissOnCancel = false;
      if (context && 'dismissOnCancel' in context) {
        dismissOnCancel = context.dismissOnCancel;
      }

      TaskModalDialogTemplateRenderer.render(this.templateName, task);
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        this.deleteQuestionPlaceholderSelector,
        this.deleteQuestionTemplateName,
        task
      );
      // assign button handlers for rendered fragment
      this.assignFormHandlers(task, dismissOnCancel);
    }
  }

  var TaskMarkAsDoneForm = {
    templateName: '#task-short-info-question-template',

    raiseQuestionPlaceholderSelector: '#task-short-info-question-placeholder',
    raiseQuestionTemplateName: '#task-markasdone-question-template',
    confirmationTemplateName: '#task-markasdone-confirmation-template',

    confirmButtonSelector: '#confirm-button',
    cancelButtonSelector: '#cancel-button',
    markAsDoneStatusValue: '1',

    onServerResponseSuccess: function(task) {
      // Task action done successfully. Render confirmation form
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        TaskMarkAsDoneForm.raiseQuestionPlaceholderSelector,
        TaskMarkAsDoneForm.confirmationTemplateName,
        task
      );
      // update task row on the main list
      TaskListController.updateTaskRow(task.id, task);
    },
    onServerResponseError: function(status, error) {
      ServerErrorForm.render(status, error);
    },

    onSubmit: function(task, event) {
      var url = TaskRequest.composeSubmitUrl(task);
      // get the status done value from the task-editing-form-template
      var markAsDoneData = {
        'status': TaskMarkAsDoneForm.markAsDoneStatusValue,
      }
      TaskRequest.patch(url, markAsDoneData,
        TaskMarkAsDoneForm.onServerResponseSuccess,
        TaskMarkAsDoneForm.onServerResponseError
      );
      event.preventDefault();
    },

    onCancel: function(task, dismissOnCancel) {
      if (dismissOnCancel) {
        TaskListController.hideModalDialog();
        return;
      }
      // return back to the information form
      TaskInformationForm.render(task);
    },

    assignFormHandlers: function(task, dismissOnCancel) {
      // assign confirmation button handler
      $(this.confirmButtonSelector).click(
        $.proxy(this.onSubmit, this, task));
      // assign cancel button handler
      $(this.cancelButtonSelector).click(
        $.proxy(this.onCancel, this, task, dismissOnCancel)
      );
    },

    render: function(task, context) {
      var dismissOnCancel = false;
      if (context && 'dismissOnCancel' in context) {
        dismissOnCancel = context.dismissOnCancel;
      }
      // render the form containing a short information and
      // render the question into the form
      TaskModalDialogTemplateRenderer.render(this.templateName, task);
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        this.raiseQuestionPlaceholderSelector,
        this.raiseQuestionTemplateName,
        task
      );
      // assign button handlers for rendered fragment
      this.assignFormHandlers(task, dismissOnCancel);
    }
  }

  var TaskListController = {
    taskListSelector: '.task-list',
    taskListItemSelector: '.task-list-item',
    taskListItemIdSelector: '.task-list-item#task-id-',
    taskListItemFieldSelectors: { // fields of task object corresponding to selectors
      'name': '.task-name',
      'created_by_username': '.task-created-by-username',
      'status_readable': {
        'selector': '.task-status',
        'updateMethod': 'updateTaskStatusColumn',
      },
      'accomplished_by_username': '.task-accomplished-by',
    },

    taskListItemDialogToggler: '.task-link-dialog-toggler',
    listControlButtonSelectors: {
      'edit': '#edit-button',
      'delete': '#delete-button',
      'markAsDone': '#markdone-button',
    },
    taskStatusClasses: {
      'DONE': 'label label-success',
      'NOT DONE': 'label label-primary',
    },

    getTaskRow: function(id) {
      var $taskRow = $(this.taskListItemIdSelector + id);
      return $taskRow;
    },
    getTaskRowFromChildElem: function($elem) {
      var $currentTaskItem = $elem.parents(this.taskListItemSelector);
      return $currentTaskItem;
    },
    getTaskDataFromChildElem: function($elem) {
      var $currentTaskItem = this.getTaskRowFromChildElem($elem);
      var task = $currentTaskItem.data();
      return task;
    },

    updateTaskRow: function(id, task) {
      var $taskRow = this.getTaskRow(id);
      this.updateRowDataAttributes($taskRow, task);
      this.updateTaskColumns($taskRow, task);
    },
    updateRowDataAttributes: function($taskRow, task) {
      // updating  <tr class="task-list-item" ... data-...
      $.each(task, function(key, value) {
        $taskRow.data(key, value);
        $taskRow.attr('data-' + key, value);
      });
    },
    updateTaskColumns: function($taskRow, task) {
      // updating task list columns
      $.each(this.taskListItemFieldSelectors, function(taskField, selector) {
        // place task object values into the corresponding task column by selector
        if (taskField in task) {
          if (selector.hasOwnProperty('updateMethod')) {
            // special update method exists, so deligate column update to it.
            var updateMethod = selector.updateMethod;
            if (!TaskListController.hasOwnProperty(updateMethod)) {
              throw updateMethod + ' is absent on the object';
            }
            selector = selector.selector;
            if ($taskRow.find(selector).length) {
              TaskListController[updateMethod]($taskRow, task, task[taskField], selector);
            }
          } else if ($taskRow.find(selector).length) {
            $taskRow.find(selector).text(task[taskField]);
          }
        }
      });
    },
    deleteTaskRow: function(id) {
      var $taskRow = this.getTaskRow(id);
      $taskRow.remove();
    },
    updateTaskStatusColumn: function($taskRow, task, fieldValue, selector) {
      // special update method for the task 'status' column.
      var $column = $taskRow.find(selector);
      if ($column.length !== 0) {
        var statusClass = TaskListController.taskStatusClasses[fieldValue.toUpperCase()]
        if (statusClass !== undefined) {
          $column.removeClass('label');
          $column.removeClass('label-primary');
          $column.removeClass('label-success');
          $column.addClass(statusClass);
        } else {
          throw "Can't find the class for the " + fieldValue.toUpperCase() + " status";
        }
        $column.text(fieldValue);
      }
    },

    assignListButtonHandlers: function() {
      // assign Edit button handler of the Task information form
      var $taskList = $(this.taskListSelector);
      $taskList.find('.control-buttons').on('click', this.listControlButtonSelectors['edit'],
        $.proxy(TaskListController.onTaskListEditButtonClick, TaskListController));
      $taskList.find('.control-buttons').on('click', this.listControlButtonSelectors['delete'],
        $.proxy(TaskListController.onTaskListDeleteButtonClick, TaskListController));
      $taskList.find('.control-buttons').on('click', this.listControlButtonSelectors['markAsDone'],
        $.proxy(TaskListController.onTaskLiskMarkDoneButtonClick, TaskListController));
    },
    assignStatusLabels: function() {
      $(this.taskListItemSelector).each(function(idx, taskRow) {
          var $taskRow = $(taskRow);
          var task = $taskRow.data();
          var statusValue = task['status_readable'];
          var selector = TaskListController.taskListItemFieldSelectors['status_readable'].selector;
          TaskListController.updateTaskStatusColumn($taskRow, task, statusValue, selector);
      });
    },

    onTaskListEditButtonClick: function(event) {
      var $button = $(event.currentTarget);
      var task = TaskListController.getTaskDataFromChildElem($button);
      TaskEditingForm.render(task, {
        dismissOnCancel: true
      });
      // propagate event so the modal window could be opened
    },
    onTaskListDeleteButtonClick: function(event) {
      var $button = $(event.currentTarget);
      var task = TaskListController.getTaskDataFromChildElem($button);
      TaskDeleteForm.render(task, {
        dismissOnCancel: true
      });
      // propagate event so the modal window could be opened
    },
    onTaskLiskMarkDoneButtonClick: function(event) {
      var $button = $(event.currentTarget);
      var task = TaskListController.getTaskDataFromChildElem($button);
      TaskMarkAsDoneForm.render(task, {
        dismissOnCancel: true
      });
      // propagate event so the modal window could be opened
    },
    onTaskListItemDialogToggle: function(event) {
      // get the current task data from event
      var $button = $(event.currentTarget);
      var task = TaskListController.getTaskDataFromChildElem($button);

      TaskInformationForm.render(task);
      // propagate event so the modal window could be opened
    },

    hideModalDialog: function() {
      $('#task-modal-form').modal('hide');
      $('.modal-backdrop').remove();
    },

    init: function() {
      $(this.taskListItemDialogToggler).on('click', this.onTaskListItemDialogToggle);
      this.assignListButtonHandlers();
      this.assignStatusLabels();
    },
  }

  TaskListController.init();
}());
