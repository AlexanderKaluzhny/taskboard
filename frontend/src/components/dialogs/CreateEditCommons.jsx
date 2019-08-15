/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { styled, makeStyles } from '@material-ui/core/styles';
import { Form, Field } from 'formik';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { TASK_STATUSES } from '../../constants';

export const StyledDialogContent = styled(MuiDialogContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  minWidth: '50ch',
});

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: '1em 0',
  },
}));

const TaskFieldInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const [labelWidth, setLabelWidth] = React.useState(0);
  const labelRef = React.useRef(null);
  const classes = useStyles();

  React.useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  return (
    <FormControl className={classes.formControl} variant="outlined" fullWidth>
      <InputLabel ref={labelRef} htmlFor="component-outlined">
        {props.title}
      </InputLabel>
      <OutlinedInput id="component-outlined" labelWidth={labelWidth} {...field} {...props} />
    </FormControl>
  );
};

const TaskFieldSelectStatus = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl} variant="outlined" fullWidth>
      <TextField
        label={props.title}
        select
        SelectProps={{
          native: true,
        }}
        variant="outlined"
        {...field}
        {...props}
      >
        <option key={0} value={TASK_STATUSES.NOT_DONE}>
          Not Done
        </option>
        <option key={1} value={TASK_STATUSES.DONE}>
          Done
        </option>
      </TextField>
    </FormControl>
  );
};

export function renderFormikForm(props) {
  return ({
    values, errors, dirty, status, touched, handleBlur, handleChange, handleSubmit, isSubmitting,
  }) => (
    <Form>
      <StyledDialogContent>
        {status && status.error && <div style={{ color: 'red' }}>{status.msg}</div>}
        <Field type="text" name="name" title="Name" component={TaskFieldInput} />
        {errors.name && touched.name && <div>{errors.name}</div>}
        <Field type="text" name="status" title="Status" component={TaskFieldSelectStatus} />
        {errors.status && touched.status && <div>{errors.status}</div>}
        <Field multiline type="text" name="description" title="Description" component={TaskFieldInput} />
        {errors.description && touched.description && <div>{errors.description}</div>}
      </StyledDialogContent>
      <DialogActions>
        <Button variant="outlined" type="submit" color="primary" disabled={isSubmitting || !dirty}>
          Apply
        </Button>
        <Button variant="outlined" color="secondary" onClick={props.closeDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Form>
  );
}
