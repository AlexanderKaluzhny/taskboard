/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import MuiPagination from '@material-ui/lab/Pagination';

function Pagination(props) {
  const { limit, count, onPageChange } = props;

  const pageCount = Math.ceil(count / limit);

  return (
    <MuiPagination
      color="primary"
      variant="outlined"
      count={pageCount}
      onChange={(event, page) => onPageChange(page - 1)}
    />
  );
}

Pagination.propTypes = {
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
