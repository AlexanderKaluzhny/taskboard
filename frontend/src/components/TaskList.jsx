/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import TaskListItem from './TaskListItem';
import TaskListTable from './Table';
import { taskActions } from '../constants';

class TaskList extends React.Component {
  render() {
    const { taskList } = this.props;
    const { currentUserId, statusFilter } = this.props;
    const { onStatusFilterChanged, setShowDialog } = this.props;

    return (
      <React.Fragment>
        <TaskListTable statusFilter={statusFilter} onStatusFilterChanged={onStatusFilterChanged}>
          {taskList.length > 0
            && taskList.map(listItem => (
              <TaskListItem
                id={listItem.id}
                key={listItem.id}
                data={listItem}
                currentUserId={currentUserId}
                onTaskNameClick={() => setShowDialog(taskActions.ShowTaskInfo, listItem.id)}
                onTaskEditClick={() => setShowDialog(taskActions.EditTask, listItem.id)}
                onTaskDeleteClick={() => setShowDialog(taskActions.DeleteTask, listItem.id)}
                onTaskMarkDoneClick={() => setShowDialog(taskActions.TaskMarkDone, listItem.id)}
              />
            ))}
        </TaskListTable>
      </React.Fragment>
    );
  }
}

export default TaskList;
