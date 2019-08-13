/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Button } from 'react-bootstrap';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { DoneBadge, NotDoneBadge } from './Badges';

class TaskListItem extends React.Component {
  render() {
    // TODO: error handling
    const task = this.props.data;
    const isOwnedByUser = this.props.currentUserId === task.created_by;
    const isTaskDone = task.status === 1;

    return (
      <TableRow>
        <TableCell component="th" scope="row">
          <Typography>
            <Link
              component="button"
              variant="body1"
              onClick={() => this.props.onTaskNameClick()}
            >
              {task.name}
            </Link>
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography caption="body1">
            {task.created_by_username}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {task.accomplished_by && (
            <React.Fragment>
              <DoneBadge>{task.status_readable}</DoneBadge>
              <Typography variant='caption'>
                <span className="task-accomplished-by">
                  {`by ${task.accomplished_by_username}`}
                </span>
              </Typography>
            </React.Fragment>
          )}
          {!task.accomplished_by && (
            <NotDoneBadge>{task.status_readable}</NotDoneBadge>
          )}
        </TableCell>
        <TableCell align="center">
          {isOwnedByUser && (
            <React.Fragment>
              <Button 
                title="Edit"
                onClick={() => this.props.onTaskEditClick()}
              >
                <i className="fa fa-pencil" aria-hidden="true" />
              </Button>
              <Button
                title="Delete"
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
        </TableCell>
      </TableRow>
    );
  }
}

export default TaskListItem;
