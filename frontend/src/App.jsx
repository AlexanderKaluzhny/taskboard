import React from 'react';
import memoizeOne from 'memoize-one';
import './App.css';
import NavBar from './components/NavBar';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';

const INITIAL_LIMIT = 25;
const INITIAL_OFFSET = 0;

const getQueryObject = memoizeOne((limit, offset, hideDoneTasks) => {
  return { limit, offset, hideDoneTasks };
});

class App extends React.Component {
  state = {
    currentUserId: null,
    tasksTotalNumber: null,
    limit: INITIAL_LIMIT,
    offset: INITIAL_OFFSET,
    hideDoneTasks: false,
  };

  componentDidMount() {
    fetch('api/globals/')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            tasksTotalNumber: result.tasks_total,
            currentUserId: result.current_user,
          });
        },
        error => this.setState({ error }),
      );
  }

  onPageChanged = (data) => {
    const offset = Math.ceil(data.selected * this.state.limit);
    this.setState({ offset });
  };

  onTasksTotalNumberReceived = (newNumber) => {
    if (this.state.tasksTotalNumber !== newNumber) {
      this.setState({ tasksTotalNumber: newNumber });
    }
  }

  onDoneTasksCheckbox = (checked) => {
    if (this.state.hideDoneTasks !== checked) {
      this.setState({
        hideDoneTasks: checked,
        limit: INITIAL_LIMIT,
        offset: INITIAL_OFFSET,
      });
    }
  }

  render() {
    const {
      limit,
      offset,
      tasksTotalNumber,
      currentUserId,
      hideDoneTasks,
    } = this.state;

    return (
      <div className="App">
        <NavBar />
        <TaskBoardHeader
          tasksTotalNumber={tasksTotalNumber}
          limit={limit}
          onPageChange={this.onPageChanged}
          onDoneTasksCheckbox={this.onDoneTasksCheckbox}
        />
        <TaskList
          currentUserId={currentUserId}
          query={getQueryObject(limit, offset, hideDoneTasks)}
          onTotalNumberReceived={this.onTasksTotalNumberReceived}
        />
      </div>
    );
  }
}

export default App;
