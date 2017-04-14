$(function() {

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
    submitButtonSelector: '#submit',
    cancelButtonSelector: '#cancel',

    onSubmitForm: function(event) {

    },
    onCancelForm: function(task) {
      TaskInformationForm.render(task);
    },

    assignButtonHandlers: function(task) {
      $(this.submitButtonSelector).click(function(event) {
        event.preventDefault();
      });
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
