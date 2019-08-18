import React from 'react';
import memoizeOne from 'memoize-one';
import { SnackbarProvider } from 'notistack';
import './App.css';
import { createMuiTheme, styled } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { blue } from '@material-ui/core/colors';
import NavBar from './components/NavBar';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_STATUS_FILTER } from './constants';
import TasksStateContainer from './components/TasksStateContainer';
import withDialogs from './components/withDialogs';

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[800] },
  },
});

const StyledDiv = styled('div')({
  width: '85%',
  margin: 'auto',
  overflowX: 'auto',
  padding: '1px',
});

const getQueryObject = memoizeOne((searchValue, limit, offset, statusFilter) => ({
  searchValue,
  limit,
  offset,
  statusFilter,
}));

class App extends React.Component {
  state = {
    currentUserId: null,
    profileUrl: '',
    fullName: '',
    tasksTotalNumber: 0,
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
    statusFilter: DEFAULT_STATUS_FILTER,
    searchValue: '',
  };

  componentDidMount() {
    fetch('api/globals/')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            tasksTotalNumber: result.tasks_total,
            currentUserId: result.current_user,
            profileUrl: result.profile_url,
            fullName: result.fullname,
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

  render() {
    const {
      searchValue, limit, offset, tasksTotalNumber, currentUserId, statusFilter,
      profileUrl, fullName,
    } = this.state;

    const { setShowDialog, getDialog } = this.props;

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={2000}>
            <NavBar profileUrl={profileUrl} fullName={fullName} />
            <StyledDiv>
              <TaskBoardHeader
                tasksTotalNumber={tasksTotalNumber}
                limit={limit}
                offset={offset}
                onPageChange={this.onPageChanged}
                onSearchRequested={this.onSearchRequested}
                setShowDialog={setShowDialog}
              />
              <TasksStateContainer
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
                      setShowDialog={setShowDialog}
                    />
                    {getDialog(taskManageFuncs, taskList)}
                  </React.Fragment>
                )}
              </TasksStateContainer>
            </StyledDiv>
          </SnackbarProvider>
        </ThemeProvider>
      </div>
    );
  }
}

export default withDialogs(App);
