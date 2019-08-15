import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import TitledDialog, { DialogContent } from './TitledDialog';
import { taskInformationBody } from './InfoDialog';

const DialogContentText = styled(MuiDialogContentText)({
  color: 'red',
});

export default function TaskDeleteDialog(props) {
  const { taskObject: task } = props;

  return (
    <TitledDialog title="Delete Task" {...props}>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        {taskInformationBody(task)}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary">
          Delete
        </Button>
        <Button variant="outlined" type="submit" color="primary" onClick={props.closeDialog}>
          Cancel
        </Button>
      </DialogActions>
    </TitledDialog>
  );
}
