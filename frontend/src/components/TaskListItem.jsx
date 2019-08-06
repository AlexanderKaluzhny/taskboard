/* eslint-disable react/prefer-stateless-function */
import React from "react";

class TaskListItem extends React.Component {
  render() {
    return (
      <tr
        className="task-list-item"
        id="task-id-{{ task.id }}"
        data-id="{{ task.id }}"
        data-name="{{ task.name }}"
        data-created_by="{{ task.created_by }}"
        data-created_by_username="{{ task.created_by_username }}"
        data-description="{{ task.description }}"
        data-accomplished_by="{{ task.accomplished_by }}"
        data-accomplished_by_username="{{ task.accomplished_by_username }}"
        data-status="{{ task.status }}"
        data-status_readable="{{ task.status_readable }}"
      >
        <td className="col-md-6">
          <a
            className="task-link-dialog-toggler task-name"
            role="button"
            href="#task-information"
            data-toggle="modal"
            data-target="#task-modal-form"
          >
            {'Sample task name'}
          </a>
        </td>
        <td className="col-md-2 text-center task-created-by-username">
          {'Created by Name'}
        </td>
        <td className="col-md-2 text-center">
          <span className="task-status">{'Sample status'}</span>
          <span className="task-accomplished-by" />
        </td>
        <td className="col-md-2 text-center">
          <div className="control-buttons">
            <button
              id="edit-button"
              className="submit btn btn-default"
              style="display: none;"
              title="Edit"
              role="button"
              data-toggle="modal"
              data-target="#task-modal-form"
              disabled
            >
              <i className="fa fa-pencil" aria-hidden="true" />
            </button>
            <button
              id="delete-button"
              className="submit btn btn-default"
              style="display: none;"
              title="Delete"
              role="button"
              data-toggle="modal"
              data-target="#task-modal-form"
              disabled
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </button>
            <button
              id="markdone-button"
              className="submit btn btn-default"
              title="Mark as Done"
              role="button"
              data-toggle="modal"
              data-target="#task-modal-form"
              disabled
            >
              <i className="fa fa-check-circle-o" aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
}

export default TaskListItem;
