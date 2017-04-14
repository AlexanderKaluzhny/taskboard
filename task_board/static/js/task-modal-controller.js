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

  var TaskModalDialogController = {
    taskListItemSelector: '.task-list-item',
    taskListItemDialogToggler: '.task-dialog-toggler',
    taskInformationTemplateName: '#task-information-template',

    onTaskDialogToggle: function(event) {
      // get the item data
      // render into template
      // put rendered template into the modal dialog
      // propagete event to open modal dialog

      // get the current task data from event
      var $button = $(event.currentTarget);
      var $currentTaskItem = $(this).parents(".task-list-item");
      var task = $currentTaskItem.data();
      // render into template
      TaskModalDialogTemplateRenderer.render(TaskModalDialogController.taskInformationTemplateName, task);
    },

    init: function() {
      $(this.taskListItemDialogToggler).on('click', TaskModalDialogController.onTaskDialogToggle);
    },
  };

  TaskModalDialogController.init();
}());
