import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
  },
}));

function HeaderStatusFilterSelect(props) {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <Select
        className={classes.input}
        native
        value={props.statusFilter}
        onChange={event => props.onStatusFilterChanged(event.target.value)}
        input={<OutlinedInput margin="dense" />}
      >
        <option value={-1}>All</option>
        <option value={0}>Not Done</option>
        <option value={1}>Done</option>
      </Select>
    </FormControl>
  );
}

export default HeaderStatusFilterSelect;
