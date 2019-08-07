import React from 'react';
import './App.css';
import TaskBoardHeader from './components/TaskBoardHeader';
import TaskList from './components/TaskList';

class App extends React.Component {
  state = {
    currentUserId: undefined,
    tasksTotalNumber: undefined,
    limit: 25,
    offset: 0,
  };

  componentDidMount() {
    fetch("api/globals/")
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

  render() {
    const { limit, offset, tasksTotalNumber, currentUserId } = this.state;

    return (
      <div className="App">
        <TaskBoardHeader
          tasksTotalNumber={tasksTotalNumber}
          limit={limit}
          onPageChange={this.onPageChanged}
        />
        <TaskList
          currentUserId={currentUserId}
          query={{
            limit: limit,
            offset: offset,
          }}
        />
      </div>
    );
  }
}

export default App;
