/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Formik } from 'formik';
import { TASK_STATUSES } from '../../constants';
import { renderFormikForm } from './CreateEditCommons';
import TitledDialog from './TitledDialog';

class CreateDialog extends React.Component {
  render() {
    const { props } = this;

    return (
      <TitledDialog title="Create New Task" {...props}>
        <Formik
          initialValues={{ status: TASK_STATUSES.NOT_DONE, name: '', description: '' }}
          onSubmit={(values, actions) => {
            const { name, status, description } = values;
            props.onCreateTask(
              { name, status, description },
              /* success handler: */
              (data) => {
                actions.setSubmitting(false);
                props.enqueueSnackbar(`Task "${data.name}" created.`, { variant: 'success' });
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
      </TitledDialog>
    );
  }
}

export default CreateDialog;
