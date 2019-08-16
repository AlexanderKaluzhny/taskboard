import React from 'react';
import { withSnackbar } from 'notistack';
import TaskInfoDialog from './dialogs/InfoDialog';
import TaskEditDialog from './dialogs/EditDialog';
import TaskCreateDialog from './dialogs/CreateDialog';
import TaskDeleteDialog from './dialogs/DeleteDialog';
import TaskMarkDoneDialog from './dialogs/MarkDoneDialog';
import { taskActions } from '../constants';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/*
* HoC that provides the capability to show the Task related dialogs.
*/
const withDialogs = (WrappedComponent) => {
  class WithDialogs extends React.Component {
    state = {
      showDialog: {
        actionType: taskActions.None,
        taskId: undefined,
      },
    };

    setShowDialog = (actionType, taskId) => {
      this.setState({
        showDialog: { actionType, taskId },
      });
    };

    onDialogClose = () => {
      this.setState({ showDialog: {} });
    };

    getDialog = (taskManageFuncs, taskList) => {
      // In case some dialog was requested to be shown, prepares the dialog component
      // and provides it with the event handlers.
      const { actionType, taskId } = this.state.showDialog;
      if (!actionType) {
        return null;
      }

      let DialogComponent;
      const dialogProps = {
        closeDialog: this.onDialogClose,
      };

      switch (actionType) {
        case taskActions.TaskMarkDone:
          DialogComponent = withSnackbar(TaskMarkDoneDialog);
          dialogProps.onTaskMarkDone = taskManageFuncs.onTaskMarkDone;
          break;
        case taskActions.DeleteTask:
          DialogComponent = withSnackbar(TaskDeleteDialog);
          dialogProps.onDeleteTask = taskManageFuncs.onDeleteTask;
          break;
        case taskActions.ShowTaskInfo:
          DialogComponent = TaskInfoDialog;
          break;
        case taskActions.EditTask:
          DialogComponent = withSnackbar(TaskEditDialog);
          dialogProps.onEditTask = taskManageFuncs.onEditTask;
          break;
        case taskActions.CreateTask:
          DialogComponent = withSnackbar(TaskCreateDialog);
          dialogProps.onCreateTask = taskManageFuncs.onCreateTask;
          break;
        default:
          DialogComponent = null;
          break;
      }
      if (!DialogComponent) {
        return null;
      }

      if (DialogComponent && taskId) {
        dialogProps.taskObject = taskList.find(task => task.id === taskId);
      }

      return <DialogComponent {...dialogProps} />;
    };

    render() {
      return <WrappedComponent setShowDialog={this.setShowDialog} getDialog={this.getDialog} {...this.props} />;
    }
  }

  WithDialogs.displayName = `withApi(${getDisplayName(WrappedComponent)})`;
  return WithDialogs;
};

export default withDialogs;
