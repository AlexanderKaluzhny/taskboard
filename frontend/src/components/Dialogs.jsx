import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DoneBadge, NotDoneBadge } from './Badges';


const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});

export default function TaskInfoDialog(props) {
  const { taskObject: task } = props;

  return (
    <div>
      <Dialog
        open
        onClose={props.closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={props.closeDialog}>
          Task Information
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" component='div'>
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
    </div>
  );
}