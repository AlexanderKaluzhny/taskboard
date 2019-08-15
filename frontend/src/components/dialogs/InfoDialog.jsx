import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { DoneBadge, NotDoneBadge } from '../Badges';
import DialogTitle from './DialogTitle';

const DialogContent = styled(MuiDialogContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  minWidth: '50ch',
});

export default function TaskInfoDialog(props) {
  const { taskObject: task } = props;

  return (
    <Dialog
      open
      onClose={props.closeDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="customized-dialog-title" onClose={props.closeDialog}>
        Task Information
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="div">
          <p>
            <b>Name: </b> {task.name}
          </p>
        </Typography>
        <Divider />
        <Typography variant="body1" component="div">
          <p><b>Created by: </b> {task.created_by_username}</p>
          <p><b>Status: </b>
            {task.accomplished_by && (
              <DoneBadge>{task.status_readable}</DoneBadge>
            )}
            {!task.accomplished_by && (
              <NotDoneBadge>{task.status_readable}</NotDoneBadge>
            )}
          </p>
        </Typography>
        <Divider />
        <Typography variant="body1" component="div">
          <p>
            <b>Description: </b> {task.description}
          </p>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={props.closeDialog}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
