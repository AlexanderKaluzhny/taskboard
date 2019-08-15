import React from 'react';
import { styled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from './DialogTitle';

export const DialogContent = styled(MuiDialogContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  minWidth: '50ch',
});

export default props => (
  <Dialog open onClose={props.closeDialog} aria-labelledby="form-dialog-title">
    <DialogTitle id="customized-dialog-title" onClose={props.closeDialog}>
      {props.title}
    </DialogTitle>
    {props.children}
  </Dialog>
);
