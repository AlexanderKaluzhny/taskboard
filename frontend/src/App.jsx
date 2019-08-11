import React from 'react';
import memoizeOne from 'memoize-one';
import './App.css';
import NavBar from './components/NavBar';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';

const INITIAL_LIMIT = 25;
const INITIAL_OFFSET = 0;

const getQueryObject = memoizeOne((limit, offset, statusFilter) => {
  return { limit, offset, statusFilter };
});

class App extends React.Component {
  state = {
    currentUserId: null,
    tasksTotalNumber: null,
    limit: INITIAL_LIMIT,
    offset: INITIAL_OFFSET,
    statusFilter: '-1',
  };

  componentDidMount() {
    fetch('api/globals/')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            tasksTotalNumber: result.tasks_total,
            currentUserId: result.current_user,
            // currentUserName
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
    this.setState({ statusFilter: selectedValue });
  }

  onTasksTotalNumberReceived = (newNumber) => {
    if (this.state.tasksTotalNumber !== newNumber) {
      this.setState({ tasksTotalNumber: newNumber });
    }
  }

  render() {
    const {
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
          onPageChange={this.onPageChanged}
        />
        <TaskList
          currentUserId={currentUserId}
          query={getQueryObject(limit, offset, statusFilter)}
          statusFilter={statusFilter}
          onTotalNumberReceived={this.onTasksTotalNumberReceived}
          onStatusFilterChanged={this.onTaskStatusFilterChanged}
        />
      </div>
    );
  }
}

export default App;
