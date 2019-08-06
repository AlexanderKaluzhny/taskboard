/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Button } from 'react-bootstrap';

class TaskBoardHeader extends React.Component {
  render() {
    return (
      <div className="row task-list-page-header">
        <div className="col-md-1">
          <Button
            id="add-button"
            className="btn btn-default"
            title="Add task"
            role="button"
            data-toggle="modal"
            data-target="#task-modal-form"
          >
            <i className="fa fa-plus" aria-hidden="true" />
          </Button>
        </div>
        <div className="col-md-7">{"<Pagination>"}</div>
        <div className="col-md-3">
          <div className="checkbox">
            <a href="{{ tasksdone_checkbox.url }}">
              <label>
                <input
                  type="checkbox"
                  value=""
                  onClick='window.location.assign("{{ tasksdone_checkbox.url }}")'
                />
                {"Don't show 'Done' tasks"}
              </label>
            </a>
          </div>
        </div>
        <div className="col-md-1">
          <Button style={{ float: "right" }} className="btn btn-default">
            <span
              className="glyphicon glyphicon-wrench"
              aria-hidden="true"
            />
            Search
          </Button>
        </div>
      </div>
    );
  }
}

export default TaskBoardHeader;
