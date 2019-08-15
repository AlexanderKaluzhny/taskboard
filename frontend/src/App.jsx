import React from 'react';
import memoizeOne from 'memoize-one';
import { SnackbarProvider, withSnackbar } from 'notistack';

import './App.css';
import NavBar from './components/NavBar';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';
import {
  DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_STATUS_FILTER, taskActions,
} from './constants';
import TaskInfoDialog from './components/dialogs/InfoDialog';
import TaskEditDialog from './components/dialogs/EditDialog';
import TaskCreateDialog from './components/dialogs/CreateDialog';
import WithTaskApi from './components/withTasksApi';

const getQueryObject = memoizeOne((searchValue, limit, offset, statusFilter) => ({
  searchValue,
  limit,
  offset,
  statusFilter,
}));

class App extends React.Component {
  state = {
    currentUserId: null,
    tasksTotalNumber: 0,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
    statusFilter: DEFAULT_STATUS_FILTER,
    searchValue: '',
    showDialog: {
      actionType: taskActions.None,
      taskId: undefined,
    },
  };

  componentDidMount() {
    fetch('api/globals/')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            tasksTotalNumber: result.tasks_total,
            currentUserId: result.current_user,
            // TODO: currentUserName
          });
        },
        error => this.setState({ error }),
      );
  }

  onPageChanged = (data) => {
    const offset = Math.ceil(data.selected * this.state.limit);
    this.setState({ offset });
  };

  onTaskStatusFilterChanged = (selectedValue) => {
    if (this.state.statusFilter !== selectedValue) {
      this.setState({
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
        statusFilter: selectedValue,
      });
    }
  };

  onSearchRequested = (value) => {
    if (this.state.searchValue !== value) {
      this.setState({
        searchValue: value,
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
        statusFilter: DEFAULT_STATUS_FILTER,
      });
    }
  };

  onTasksTotalNumberReceived = (newNumber) => {
    if (this.state.tasksTotalNumber !== newNumber) {
      this.setState({ tasksTotalNumber: newNumber });
    }
  };

  setShowDialog = (actionType, taskId) => {
    this.setState({
      showDialog: { actionType, taskId },
    });
  };

  onDialogClose = () => {
    this.setState({ showDialog: {} });
  };

  getDialog(taskManageFuncs, taskList) {
    const { actionType, taskId } = this.state.showDialog;
    if (!actionType) {
      return null;
    }

    let DialogComponent;
    let dialogProps = {};

    switch (actionType) {
      case taskActions.ShowTaskInfo:
        DialogComponent = TaskInfoDialog;
        dialogProps = {
          closeDialog: this.onDialogClose,
        };
        break;
      case taskActions.EditTask:
        DialogComponent = withSnackbar(TaskEditDialog);
        dialogProps = {
          onEditTask: taskManageFuncs.onEditTask,
          closeDialog: this.onDialogClose,
        };
        break;
      case taskActions.CreateTask:
        DialogComponent = withSnackbar(TaskCreateDialog);
        dialogProps = {
          closeDialog: this.onDialogClose,
          onCreateTask: taskManageFuncs.onCreateTask,
        };
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
  }

  render() {
    const {
      searchValue, limit, offset, tasksTotalNumber, currentUserId, statusFilter,
    } = this.state;

    return (
      <div className="App">
        <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={2000}>
          <NavBar />
          <TaskBoardHeader
            tasksTotalNumber={tasksTotalNumber}
            limit={limit}
            offset={offset}
            onPageChange={this.onPageChanged}
            onSearchRequested={this.onSearchRequested}
            setShowDialog={this.setShowDialog}
          />
          <WithTaskApi
            query={getQueryObject(searchValue, limit, offset, statusFilter)}
            onTotalNumberReceived={this.onTasksTotalNumberReceived}
          >
            {(taskManageFuncs, taskList) => (
              <React.Fragment>
                <TaskList
                  taskList={taskList}
                  currentUserId={currentUserId}
                  statusFilter={statusFilter}
                  onStatusFilterChanged={this.onTaskStatusFilterChanged}
                  setShowDialog={this.setShowDialog}
                />
                {this.getDialog(taskManageFuncs, taskList)}
              </React.Fragment>
            )}
          </WithTaskApi>
        </SnackbarProvider>
      </div>
    );
  }
}

export default App;
