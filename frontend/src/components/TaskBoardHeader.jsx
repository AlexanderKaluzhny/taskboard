/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Pagination from './Pagination';

class TaskBoardHeader extends React.Component {
  render() {
    const { limit, tasksTotalNumber, onPageChange, onDoneTasksCheckbox } = this.props;

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
        <div className="col-md-7">
          {!!tasksTotalNumber && (
            <Pagination
              limit={limit}
              count={tasksTotalNumber}
              onPageChange={onPageChange}
              key={tasksTotalNumber}
            />
          )}
        </div>
        <div className="col-md-3">
          <div className="checkbox">
            <Form.Check
              type="checkbox"
              label={"Don't show 'Done' tasks"}
              onChange={evt => onDoneTasksCheckbox(evt.target.checked)}
            />
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
