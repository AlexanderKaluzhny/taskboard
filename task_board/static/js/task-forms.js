var TaskEditingForm = {
  formTemplate: '#task-editing-form-template',
  formSelector: '#task-editing-form',
  submitButtonSelector: '#submit',
  cancelButtonSelector: '#cancel',

  onTaskEditedResponseSuccess: function(task) {
    // handles editing form server response
    TaskInformationForm.render(task);
    TaskListController.updateTaskRowById(task.id, task);
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
    // renders the TaskEditingForm
    //
    var dismissOnCancel = false;
    if (context && 'dismissOnCancel' in context) {
      dismissOnCancel = context.dismissOnCancel;
    }

    TaskModalDialogTemplateRenderer.render(TaskEditingForm.formTemplate, task);
    this.assignFormHandlers(task, dismissOnCancel);
  },
};

// ============================================================================
// ============================================================================

var TaskAddForm = {
  formTemplate: '#task-editing-form-template',
  formSelector: '#task-editing-form',
  submitButtonSelector: '#submit',
  cancelButtonSelector: '#cancel',

  onTaskEditedResponseSuccess: function(task) {
    // handles editing form server response
    TaskInformationForm.render(task);
    TaskListController.addTaskRow(task);
  },
  onTaskEditedResponseError: function(status, error) {
    ServerErrorForm.render(status, error);
  },

  onSubmitForm: function(event) {
    // get form data and submit it
    var $form = $(event.currentTarget);
    var form_data = serializeForm($form);
    var url = TaskRequest.taskRootUrl;
    TaskRequest.post(url, form_data,
      TaskAddForm.onTaskEditedResponseSuccess,
      TaskAddForm.onTaskEditedResponseError
    );

    event.preventDefault();
  },
  onCancelForm: function() {
      TaskListController.hideModalDialog();
      return;
  },

  assignFormHandlers: function() {
    $(this.formSelector).on('submit', $.proxy(this.onSubmitForm, this));
    $(this.cancelButtonSelector).click(
      $.proxy(this.onCancelForm, this)
    );
  },

  render: function() {
    // renders the TaskAddForm
    //
    TaskModalDialogTemplateRenderer.render(TaskAddForm.formTemplate, {});
    this.assignFormHandlers();
  },
};

// ============================================================================
// ============================================================================

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
    //
    var $renderedDiv = TaskModalDialogTemplateRenderer.render(this.taskInformationTemplateName, task);
    // update displaying of particular form fields
    TaskView.assignTaskStatusLabel($renderedDiv, task);
    TaskView.displayTaskButtons($renderedDiv, task, this.controlButtonSelectors);
    // assign button handlers for rendered fragment
    this.assignFormHandlers(task, $renderedDiv);
  }
};

// ============================================================================
// ============================================================================

var ServerErrorForm = {
  templateName: '#server-error-template',

  render: function(status, error) {
    TaskModalDialogTemplateRenderer.render(this.templateName, {
      "status": status,
      "error": error,
    });
  },
};

// ============================================================================
// ============================================================================

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
    // renders the TaskDeleteForm
    //
    var dismissOnCancel = false;
    if (context && 'dismissOnCancel' in context) {
      dismissOnCancel = context.dismissOnCancel;
    }

    var $renderedDiv = TaskModalDialogTemplateRenderer.render(this.templateName, task);
    TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
      this.deleteQuestionPlaceholderSelector,
      this.deleteQuestionTemplateName,
      task
    );
    // update displaying of particular form fields
    TaskView.assignTaskStatusLabel($renderedDiv, task);
    // assign button handlers for rendered fragment
    this.assignFormHandlers(task, dismissOnCancel);
  }
};

// ============================================================================
// ============================================================================

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
    TaskListController.updateTaskRowById(task.id, task);
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
    // renders the TaskMarkAsDoneForm
    //
    var dismissOnCancel = false;
    if (context && 'dismissOnCancel' in context) {
      dismissOnCancel = context.dismissOnCancel;
    }
    // render the form containing a short information and
    // render the question into the form
    var $renderedDiv = TaskModalDialogTemplateRenderer.render(this.templateName, task);
    TaskModalDialogTemplateRenderer.renderIntoPlacehoder(
      this.raiseQuestionPlaceholderSelector,
      this.raiseQuestionTemplateName,
      task
    );
    // update displaying of particular form fields
    TaskView.assignTaskStatusLabel($renderedDiv, task);
    // assign button handlers for rendered fragment
    this.assignFormHandlers(task, dismissOnCancel);
  }
};
