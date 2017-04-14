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
      if (xhr.status == 400) {} else if (xhr.status == 500) {}
      onErrorHandler(error);
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
    }
  };

  var TaskEditingForm = {
    formTemplate: '#task-editing-form-template',
    formSelector: '#task-editing-form',
    submitButtonSelector: '#submit',
    cancelButtonSelector: '#cancel',
    submitUrl: ['/tasks/', 'TASK ID HERE', '/'],

    composeSubmitUrl: function(task) {
      var url = TaskEditingForm.submitUrl;
      url[1] = task.id;
      return url.join('');
    },

    onSubmitForm: function(task, event) {
      event.preventDefault();
      var $form = $(event.currentTarget);
      var form_data = serializeForm($form);
      // TODO: remove {% url 'api-v1:task-update' '26' %} 
      var url = $form[0].action; // TaskEditingForm.composeSubmitUrl(task);
      TaskRequest.patch(url, form_data);
    },
    onCancelForm: function(task) {
      TaskInformationForm.render(task);
    },

    assignButtonHandlers: function(task) {
      $(this.formSelector).on('submit', $.proxy(this.onSubmitForm, this, task));
      $(this.cancelButtonSelector).click(
        $.proxy(this.onCancelForm, this, task)
      );
    },

    render: function(task) {
      TaskModalDialogTemplateRenderer.render(TaskEditingForm.formTemplate, task)
      this.assignButtonHandlers(task);
    },
  }

  var TaskInformationForm = {
    taskInformationTemplateName: '#task-information-template',
    controlButtonSelectors: {
      'edit': '#edit-button'
    },

    assignButtonHandlers: function(task) {
      // assign Edit button handler of the Task information form
      $('.control-buttons').on('click', this.controlButtonSelectors['edit'],
        $.proxy(TaskEditingForm.render, TaskEditingForm, task));
    },

    render: function(task) {
      // render the TaskInformationForm template
      TaskModalDialogTemplateRenderer.render(this.taskInformationTemplateName, task);
      // assign button handlers for rendered fragment
      this.assignButtonHandlers(task);
    }
  }

  var TaskModalDialogController = {
    taskListItemSelector: '.task-list-item',
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
