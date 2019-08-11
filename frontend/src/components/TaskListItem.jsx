/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Button } from 'react-bootstrap';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MuiBadge from '@material-ui/core/Badge';
import { styled } from '@material-ui/core/styles';

const DoneBadge = styled(MuiBadge)({
  minWidth: '3rem',
  padding: '0 6px',
  textAlign: 'center',
  // -webkit-box-sizing: 'border-box',
  boxSizing: 'border-box',

  fontWeight: '300',
  fontSize: '0.9rem',
  backgroundColor: '#26a69a',
  borderRadius: '2px',

  color: "white",
});

const NotDoneBadge = styled(DoneBadge)({
  backgroundColor: "#337ab7",
});


class TaskListItem extends React.Component {
  render() {
    // TODO: error handling
    const task = this.props.data;
    const isOwnedByUser = this.props.currentUserId === task.created_by;
    const isTaskDone = task.status === 1;

    return (
      <TableRow>
        <TableCell component="th" scope="row">
          {task.name}
        </TableCell>
        <TableCell align='center'>{task.created_by_username}</TableCell>
        <TableCell align='center'>
          {task.accomplished_by && (
            <React.Fragment>
              <DoneBadge>{task.status_readable}</DoneBadge>
              <span className="task-accomplished-by">
                {`by ${task.accomplished_by_username}`}
              </span>
            </React.Fragment>
          )}
          {!task.accomplished_by && (
            <NotDoneBadge>{task.status_readable}</NotDoneBadge>
          )}
        </TableCell>
        <TableCell align='center'>
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
        </TableCell>
      </TableRow>
    );
  }
}

export default TaskListItem;
