/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { styled } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { DoneBadge, NotDoneBadge } from './Badges';

const ActionsTableCell = styled(TableCell)({
  // eliminates shrinking of action buttons cell when there is only one button
  width: '25%',
});

export default function TaskListItem(props) {
  const task = props.data;
  const isOwnedByUser = props.currentUserId === task.created_by;
  const isTaskDone = task.status === 1;

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Typography>
          <Link component="button" variant="body1" onClick={() => props.onTaskNameClick()}>
            {task.name}
          </Link>
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography caption="body1">{task.created_by_username}</Typography>
      </TableCell>
      <TableCell align="center">
        {task.accomplished_by && (
          <React.Fragment>
            <DoneBadge>{task.status_readable}</DoneBadge>
            <Typography variant="caption">
              <span className="task-accomplished-by">{`by ${task.accomplished_by_username}`}</span>
            </Typography>
          </React.Fragment>
        )}
        {!task.accomplished_by && <NotDoneBadge>{task.status_readable}</NotDoneBadge>}
      </TableCell>
      <ActionsTableCell align="center">
        {isOwnedByUser && (
          <React.Fragment>
            <IconButton aria-label="edit" onClick={() => props.onTaskEditClick()}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => props.onTaskDeleteClick()}>
              <DeleteIcon color="primary" />
            </IconButton>
          </React.Fragment>
        )}
        <IconButton aria-label="Mark as Done" disabled={isTaskDone} onClick={() => props.onTaskMarkDoneClick()}>
          <DoneIcon color={!isTaskDone ? 'primary' : 'disabled'} />
        </IconButton>
      </ActionsTableCell>
    </TableRow>
  );
}
