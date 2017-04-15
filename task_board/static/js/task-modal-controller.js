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
    onCancelForm: function(task) {
      TaskInformationForm.render(task);
    },

    assignFormHandlers: function(task) {
      $(this.formSelector).on('submit', $.proxy(this.onSubmitForm, this, task));
      $(this.cancelButtonSelector).click(
        $.proxy(this.onCancelForm, this, task)
      );
    },

    render: function(task) {
      TaskModalDialogTemplateRenderer.render(TaskEditingForm.formTemplate, task)
      this.assignFormHandlers(task);
    },
  };

  var TaskInformationForm = {
    taskInformationTemplateName: '#task-information-template',
    controlButtonSelectors: {
      'edit': '#edit-button',
      'delete': '#delete-button'
    },

    assignFormHandlers: function(task) {
      // assign Edit button handler of the Task information form
      $('.control-buttons').on('click', this.controlButtonSelectors['edit'],
        $.proxy(TaskEditingForm.render, TaskEditingForm, task));
      $('.control-buttons').on('click', this.controlButtonSelectors['delete'],
        $.proxy(TaskDeleteForm.render, TaskDeleteForm, task));

    },

    render: function(task) {
      // render the TaskInformationForm template
      TaskModalDialogTemplateRenderer.render(this.taskInformationTemplateName, task);
      // assign button handlers for rendered fragment
      this.assignFormHandlers(task);
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
    templateName: '#task-delete-form-template',

    deleteQuestionPlaceholderSelector: '#task-delete-question-placeholder',
    deleteQuestionTemplateName: '#task-delete-question-template',
    confirmationTemplateName: '#task-delete-confirmation-template',

    confirmButtonSelector: '#confirm-button',
    cancelButtonSelector: '#cancel-button',

    onTaskDeleteResponseSuccess: function(task) {
      // Task deleted successfully. Render confirmation form
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        this.deleteQuestionPlaceholderSelector,
        this.confirmationTemplateName,
        task
      );
      TaskListController.deleteTaskRow(task.id, task);
    },
    onTaskDeleteResponseError: function(status, error) {
      ServerErrorForm.render(status, error);
    },

    onSubmitForm: function(task, event) {
      var url = TaskRequest.composeSubmitUrl(task);
      // TaskRequest.delete(url,
      //   $.proxy(TaskDeleteForm.onTaskDeleteResponseSuccess, TaskDeleteForm, task),
      //   TaskDeleteForm.onTaskDeleteResponseError
      // );
      /***********/
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        this.deleteQuestionPlaceholderSelector,
        this.confirmationTemplateName,
        task
      );
      TaskListController.deleteTaskRow(task.id);
      /***********/
      event.preventDefault();
    },

    onCancelForm: function(task) {
      TaskInformationForm.render(task);
    },

    assignFormHandlers: function(task) {
      // assign delete confirmation button handler
      $(this.confirmButtonSelector).click(
        $.proxy(this.onSubmitForm, this, task));
      // assign cancel delete button handler
      $(this.cancelButtonSelector).click(
        $.proxy(this.onCancelForm, this, task)
      );
    },

    render: function(task) {
      TaskModalDialogTemplateRenderer.render(this.templateName, task);
      TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
        this.deleteQuestionPlaceholderSelector,
        this.deleteQuestionTemplateName,
        task
      );
      // assign button handlers for rendered fragment
      this.assignFormHandlers(task);
    }
  }

  var TaskListController = {
    taskListItemSelector: '.task-list-item',
    taskListItemIdSelector: '.task-list-item#task-id-',
    taskListItemFieldSelectors: { // fields of task object corresponding to selectors
      'name': '.task-name',
      'created_by_username': '.task-created-by-username',
      'status': '.task-status',
      'accomplished_by': '.task-accomplished-by',
    },

    getTaskRow: function(id) {
      var $taskRow = $(this.taskListItemIdSelector + id);
      return $taskRow;
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
          if ($taskRow.find(selector).length) {
            $taskRow.find(selector).text(task[taskField]);
          }
        }
      });
    },
    deleteTaskRow: function(id){
      var $taskRow = this.getTaskRow(id);
      $taskRow.remove();
    },
  }

  var TaskModalDialogController = {
    taskListItemDialogToggler: '.task-link-dialog-toggler',

    onTaskListEditButtonClick: function(event) {
      // render edit form
      // TODO: setup toggling of dialog in html
    },

    onTaskListItemDialogToggle: function(event) {
      // get the current task data from event
      var $button = $(event.currentTarget);
      var $currentTaskItem = $(this).parents(".task-list-item");
      var task = $currentTaskItem.data();

      TaskInformationForm.render(task);
    },

    init: function() {
      $(this.taskListItemDialogToggler).on('click', this.onTaskListItemDialogToggle);
    },
  };

  TaskModalDialogController.init();
}());
