/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Button } from 'react-bootstrap';

class TaskListItem extends React.Component {
  render() {
    // TODO: error handling

    const task = this.props.data;
    const isOwnedByUser = this.props.currentUserId === task.created_by;
    const isTaskDone = task.status === 1;

    return (
      <tr className="task-list-item">
        <td className="col-md-6">
          <a
            className="task-link-dialog-toggler task-name"
            role="button"
            href="#task-information"
            data-toggle="modal"
            data-target="#task-modal-form"
          >
            {task.name}
          </a>
        </td>
        <td className="col-md-2 text-center task-created-by-username">
          {task.created_by_username}
        </td>
        <td className="col-md-2 text-center">
          <span className="task-status">{task.status_readable}</span>
          {task.accomplished_by && (
            <span className="task-accomplished-by">
              {task.accomplished_by_username}
            </span>
          )}
        </td>
        <td className="col-md-2 text-center">
          <div className="control-buttons">
            {isOwnedByUser && (
              <React.Fragment>
                <Button
                  id="edit-button"
                  className="submit btn btn-default"
                  title="Edit"
                  role="button"
                  data-toggle="modal"
                  data-target="#task-modal-form"
                >
                  <i className="fa fa-pencil" aria-hidden="true" />
                </Button>
                <Button
                  id="delete-button"
                  className="submit btn btn-default"
                  title="Delete"
                  role="button"
                  data-toggle="modal"
                  data-target="#task-modal-form"
                >
                  <i className="fa fa-trash" aria-hidden="true" />
                </Button>
              </React.Fragment>
            )}
            <Button
              id="markdone-button"
              className="submit btn btn-default"
              title="Mark as Done"
              role="button"
              data-toggle="modal"
              data-target="#task-modal-form"
              disabled={isTaskDone}
            >
              <i className="fa fa-check-circle-o" aria-hidden="true" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }
}

export default TaskListItem;
