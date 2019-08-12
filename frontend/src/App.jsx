import React from 'react';
import memoizeOne from 'memoize-one';
import './App.css';
import NavBar from './components/NavBar';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';

const DEFAULT_LIMIT = 25;
const DEFAULT_OFFSET = 0;
const DEFAULT_STATUS_FILTER = '-1';

const getQueryObject = memoizeOne((searchValue, limit, offset, statusFilter) => {
  return { searchValue, limit, offset, statusFilter };
});

class App extends React.Component {
  state = {
    currentUserId: null,
    tasksTotalNumber: null,
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
            currentUserId: result.current_user
            // currentUserName
          });
        },
        error => this.setState({ error })
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
        statusFilter: selectedValue
      });
    }
  };

  onSearchRequested = (value) => {
    if (this.state.searchValue !== value) {
      this.setState({
        searchValue: value,
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
        statusFilter: DEFAULT_STATUS_FILTER
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
      searchValue,
      limit,
      offset,
      tasksTotalNumber,
      currentUserId,
      statusFilter,
    } = this.state;

    return (
      <div className="App">
        <NavBar />
        <TaskBoardHeader
          tasksTotalNumber={tasksTotalNumber}
          limit={limit}
          offset={offset}
          onPageChange={this.onPageChanged}
          onSearchRequested={this.onSearchRequested}
        />
        <TaskList
          currentUserId={currentUserId}
          query={getQueryObject(searchValue, limit, offset, statusFilter)}
          statusFilter={statusFilter}
          onTotalNumberReceived={this.onTasksTotalNumberReceived}
          onStatusFilterChanged={this.onTaskStatusFilterChanged}
        />
      </div>
    );
  }
}

export default App;
