/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SearchBar from 'material-ui-search-bar';
import Pagination from './Pagination';
import { taskActions } from '../constants';

const StyledSearchBar = styled(SearchBar)({
  marginBlockStart: '1em',
  marginBlockEnd: '1em',
});

class TaskBoardHeader extends React.Component {
  state = {
    searchValue: '',
  };

  render() {
    const {
      limit, offset, tasksTotalNumber, onPageChange, onSearchRequested, setShowDialog,
    } = this.props;

    return (
      <React.Fragment>
        <Grid container alignItems="center" justify="center" direction="row">
          <Grid item xs={1}>
            <Button
              variant="contained"
              title="Add task"
              color="primary"
              onClick={() => setShowDialog(taskActions.CreateTask)}
            >
              <i className="fa fa-plus" aria-hidden="true" />
            </Button>
          </Grid>
          <Grid item xs={4}>
            {!!tasksTotalNumber && (
              <Pagination limit={limit} offset={offset} count={tasksTotalNumber} onPageChange={onPageChange} />
            )}
          </Grid>
          <Grid item xs={4}>
            <StyledSearchBar
              value={this.state.searchValue}
              onChange={newValue => this.setState({ searchValue: newValue })}
              onCancelSearch={() => onSearchRequested(null)}
              onRequestSearch={() => onSearchRequested(this.state.searchValue)}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default TaskBoardHeader;
