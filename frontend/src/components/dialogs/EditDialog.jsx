/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Formik } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from './DialogTitle';
import { renderFormikForm } from './CreateEditCommons';

class EditDialog extends React.Component {
  // TODO: show form errors
  render() {
    const { props } = this;

    return (
      <Dialog open onClose={props.closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="customized-dialog-title" onClose={props.closeDialog}>
          Edit Task
        </DialogTitle>
        <Formik
          initialValues={{ ...props.taskObject }}
          onSubmit={(values, actions) => {
            const { name, status, description } = values;
            props.onEditTask(
              props.taskObject.id,
              { name, status, description },
              /* success handler: */
              (data) => {
                actions.setSubmitting(false);
                props.enqueueSnackbar(`Task "${name}" updated.`, { variant: 'success' });
                props.closeDialog();
              },
              /* error handler: */
              (serverStatus, error, responseJSON) => {
                actions.setSubmitting(false);
                actions.setErrors(responseJSON);
                if (serverStatus > 400) {
                  actions.setStatus({
                    error: true,
                    msg: `Error ${serverStatus}: ${error}`,
                  });
                }
              },
            );
          }}
          render={renderFormikForm(props)}
        />
      </Dialog>
    );
  }
}

export default EditDialog;
