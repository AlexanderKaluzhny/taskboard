import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import TitledDialog, { DialogContent } from './TitledDialog';
import { taskInformationBody } from './InfoDialog';

const DialogContentText = styled(MuiDialogContentText)({
  color: '#26a69a',
});

const DoneButton = styled(Button)({
  color: '#26a69a',
  borderColor: 'inherit',
});

export default function TaskMarkDoneDialog(props) {
  const { taskObject: task } = props;

  return (
    <TitledDialog title="Mark as Done" {...props}>
      <DialogContent>
        <DialogContentText>Are you sure you want to mark this task as "Done" by you?</DialogContentText>
        {taskInformationBody(task)}
      </DialogContent>
      <DialogActions>
        <DoneButton
          variant="outlined"
          onClick={() => {
            // closing the dialog early, otherwise after successful delete
            // it will be rerendered with undefined task.
            props.closeDialog();
            props.onTaskMarkDone(
              props.taskObject.id,
              /* success handler: */
              () => {
                props.enqueueSnackbar(`Task "${task.name}" marked as "Done"`, { variant: 'success' });
              },
              /* error handler: */
              (serverStatus, error, responseText) => {
                props.enqueueSnackbar(`Error ${serverStatus}: ${error}. ${responseText}`, { variant: 'error' });
              },
            );
          }}
        >
          Done
        </DoneButton>
        <Button variant="outlined" type="submit" onClick={props.closeDialog}>
          Cancel
        </Button>
      </DialogActions>
    </TitledDialog>
  );
}
