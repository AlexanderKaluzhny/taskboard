/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import qs from 'query-string';
import TaskListItem from './TaskListItem';
import TaskListTable from './Table';

class TaskList extends React.Component {
  state = {
    isLoaded: false,
    tasksList: [],
    currentTotalNumber: 0,
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

  fetchTasks() {
    fetch(`api/tasks/?${qs.stringify(this.getQueryParams())}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState(
            {
              isLoaded: true,
              tasksList: result.results,
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
    const { tasksList } = this.state;
    const { currentUserId, statusFilter } = this.props;
    const { onStatusFilterChanged } = this.props;

    return (
      <TaskListTable statusFilter={statusFilter} onStatusFilterChanged={onStatusFilterChanged}>
        {tasksList.length > 0 &&
          tasksList.map(listItem => (
            <TaskListItem
              id={listItem.id}
              key={listItem.id}
              data={listItem}
              currentUserId={currentUserId}
            />
          ))}
      </TaskListTable>
    );
  }
}


export default TaskList;
