/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withSnackbar } from 'notistack';
import TaskListItem from './TaskListItem';
import TaskListTable from './Table';
import TaskInfoDialog from './dialogs/InfoDialog';
import TaskEditDialog from './dialogs/EditDialog';
import withTasksApi from './withTasksApi';

const taskActions = {
  None: 0,
  ShowTaskInfo: 1,
  EditTask: 2,
};

class TaskList extends React.Component {
  state = {
    isLoaded: false,
    showDialog: {
      actionType: taskActions.None,
      taskId: undefined,
    },
  }

  getDialog(showDialogSettings, taskList) {
    let DialogComponent;
    const { actionType, taskId } = showDialogSettings;

    if (!actionType || !taskId) {
      return null;
    }

    switch (actionType) {
      case taskActions.ShowTaskInfo:
        DialogComponent = TaskInfoDialog;
        break;
      case taskActions.EditTask:
        DialogComponent = withSnackbar(TaskEditDialog);
        break;
      default:
        DialogComponent = null;
        break;
    }
    if (!DialogComponent) {
      return null;
    }

    return (
      <DialogComponent
        onEditTask={this.props.onEditTask}
        closeDialog={this.onDialogClose}
        taskObject={taskList.find(task => task.id === taskId)}
      />
    );
  }

  setShowDialog = (actionType, taskId) => {
    this.setState({
      showDialog: { actionType, taskId },
    });
  }

  onDialogClose = () => {
    this.setState({ showDialog: {} });
  };

  render() {
    const { taskList } = this.props;
    const { currentUserId, statusFilter } = this.props;
    const { onStatusFilterChanged } = this.props;
    const showDialogSettings = this.state.showDialog;

    return (
      <React.Fragment>
        <TaskListTable
          statusFilter={statusFilter}
          onStatusFilterChanged={onStatusFilterChanged}
        >
          {taskList.length > 0 &&
            taskList.map(listItem => (
              <TaskListItem
                id={listItem.id}
                key={listItem.id}
                data={listItem}
                currentUserId={currentUserId}
                onTaskNameClick={() => this.setShowDialog(taskActions.ShowTaskInfo, listItem.id)}
                onTaskEditClick={() => this.setShowDialog(taskActions.EditTask, listItem.id)}
              />
            ))}
        </TaskListTable>
        {this.getDialog(showDialogSettings, taskList)}
      </React.Fragment>
    );
  }
}


export default withTasksApi(TaskList);
