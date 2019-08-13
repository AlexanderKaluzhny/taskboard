/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import qs from 'query-string';
import TaskListItem from './TaskListItem';
import TaskListTable from './Table';
import TaskInfoDialog from './dialogs/InfoDialog';
import TaskEditDialog from './dialogs/EditDialog';

const taskActions = {
  None: 0,
  ShowTaskInfo: 1,
  EditTask: 2,
};

class TaskList extends React.Component {
  state = {
    isLoaded: false,
    taskList: [],
    currentTotalNumber: 0,
    showDialog: {
      actionType: taskActions.None,
      taskId: undefined,
    },
  }

  componentDidMount() {
    this.fetchTasks();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchTasks();
    }
  }

  getQueryParams() {
    const { searchValue, limit, offset, statusFilter } = this.props.query;
    let queryParams = { limit, offset };
    if (statusFilter !== '-1') {
      queryParams.status = statusFilter;
    }
    if (!!searchValue) {
      queryParams.search = searchValue;
    }

    return queryParams;
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
        DialogComponent = TaskEditDialog;
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

  fetchTasks() {
    fetch(`api/tasks/?${qs.stringify(this.getQueryParams())}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState(
            {
              isLoaded: true,
              taskList: result.results,
              currentTotalNumber: result.count
            },
            () => {
              this.props.onTotalNumberReceived(result.count);
            }
          );
        },
        error => this.setState({ isLoaded: false, error })
      );
  }

  render() {
    const { error } = this.state;
    const { taskList } = this.state;
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


export default TaskList;
