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

var TaskView = {
  // Contains the logic on updating of task information displayed in the columns
  // of the Task List.
  //
  taskListItemFieldSelectors: { // fields of task object corresponding to selectors
    'name': '.task-name',
    'created_by_username': '.task-created-by-username',
    'status_readable': {
      'selector': '.task-status',
      'updateMethod': 'updateTaskStatusColumn',
    },
    'accomplished_by_username': {
      'selector': '.task-accomplished-by',
      'updateMethod': 'updateTaskAccomplishedByColumn',
    }
  },
  taskStatusClasses: {
    'DONE': 'label label-success',
    'NOT DONE': 'label label-primary',
  },
  allowedButtonsForOwner: ['edit', 'delete', 'markAsDone'],
  allowedButtonsForEverybody: ['markAsDone'],

  updateTaskColumns: function($taskRow, task) {
    // updating of task list columns with the values of Task object.
    //
    $.each(this.taskListItemFieldSelectors, function(taskField, selector) {
      // place task object values into the corresponding task column by selector
      if (taskField in task) {
        if (selector.hasOwnProperty('updateMethod')) {
          // special update method exists, so deligate column update to it.
          var updateMethod = selector.updateMethod;
          if (!TaskView.hasOwnProperty(updateMethod)) {
            throw updateMethod + ' is absent on the object';
          }
          selector = selector.selector;
          if ($taskRow.find(selector).length) {
            TaskView[updateMethod]($taskRow, task, task[taskField], selector);
          }
        } else if ($taskRow.find(selector).length) {
          $taskRow.find(selector).text(task[taskField]);
        }
      }
    });
    // display buttons based on update task information
    TaskView.displayTaskButtons($taskRow, task, TaskListController.listControlButtonSelectors);
  },
  updateTaskStatusColumn: function($taskRow, task, fieldValue, selector) {
    // special update method for the task 'status' column.
    //
    // get the particular placeholder where to place the value
    var $column = $taskRow.find(selector);
    if ($column.length !== 0) {
      var statusClass = TaskView.taskStatusClasses[fieldValue.toUpperCase()]
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
  updateTaskAccomplishedByColumn: function($taskRow, task, fieldValue, selector) {
    // special update method for the task 'accomplished_by' column,
    // its rendering depends on the task 'status' value.
    //
    // get the particular placeholder where to place the value
    var $column = $taskRow.find(selector);
    if ($column.length === 0) {
      return;
    }
    $column.empty();
    if ('status' in task && task['status'] == 1) {
      $column.html('</p> by ' + fieldValue);
    }
  },
  assignTaskStatusLabel: function($taskRow, task) {
    // add the label class according to status. Done - label-success.
    //
    var taskField = 'status_readable';
    var statusValue = task[taskField];
    var selector = TaskView.taskListItemFieldSelectors[taskField].selector;
    TaskView.updateTaskStatusColumn($taskRow, task, statusValue, selector);
  },
  assignTaskAccomplishedBy: function($taskRow, task) {
    // display the accomplished_by sting on the task
    //
    var taskField = 'accomplished_by_username';
    var statusValue = task[taskField];
    var selector = TaskView.taskListItemFieldSelectors[taskField].selector;
    TaskView.updateTaskAccomplishedByColumn($taskRow, task, statusValue, selector);
  },
  displayTaskButtons: function ($taskRow, task, buttonToSelectorsMapping) {
    // display task action buttons based on task ownership.
    //
    var currentUserId = TaskListController.getCurrentUserId();
    var buttonsToDisplay = this.allowedButtonsForEverybody;
    if (task.created_by == currentUserId) {
      buttonsToDisplay = this.allowedButtonsForOwner;
    }

    $.each(buttonToSelectorsMapping, function(buttonName, buttonSelector) {
      if (buttonsToDisplay.indexOf(buttonName) != -1) {
        $taskRow.find(buttonSelector).show();
        $taskRow.find(buttonSelector).prop('disabled', false);
      } else {
        $taskRow.find(buttonSelector).hide();
        $taskRow.find(buttonSelector).prop('disabled', true);
      }
    });
    if (task['status'] == 1) {
      // disable the 'markAsDone' button if task is 'Done'
      var buttonSelector = buttonToSelectorsMapping['markAsDone'];
      $taskRow.find(buttonSelector).prop('disabled', true);
    }
  },
}

var TaskListController = {
  // Manages the Task table and its rows
  //
  taskListSelector: '.task-list',
  taskListItemSelector: '.task-list-item',
  taskListItemIdSelector: '.task-list-item#task-id-',

  taskListItemDialogToggler: '.task-link-dialog-toggler',
  listControlButtonSelectors: {
    'edit': '#edit-button',
    'delete': '#delete-button',
    'markAsDone': '#markdone-button',
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
    TaskView.updateTaskColumns($taskRow, task);
  },
  updateRowDataAttributes: function($taskRow, task) {
    // updating  <tr class="task-list-item" ... data-...
    $.each(task, function(key, value) {
      $taskRow.data(key, value);
      $taskRow.attr('data-' + key, value);
    });
  },
  deleteTaskRow: function(id) {
    var $taskRow = this.getTaskRow(id);
    $taskRow.remove();
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
  updateTaskColumnValues: function() {
    $(this.taskListItemSelector).each(function(idx, taskRow) {
      var $taskRow = $(taskRow);
      var task = $taskRow.data();
      TaskView.assignTaskStatusLabel($taskRow, task);
      TaskView.assignTaskAccomplishedBy($taskRow, task);
      TaskView.displayTaskButtons($taskRow, task, TaskListController.listControlButtonSelectors);
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

  getCurrentUserId: function(){
    return $('#current-user-id').data('id');
  },

  init: function() {
    $(this.taskListItemDialogToggler).on('click', this.onTaskListItemDialogToggle);
    this.assignListButtonHandlers();
    this.updateTaskColumnValues();
  },
}

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

    TaskListController.init();
  }());
