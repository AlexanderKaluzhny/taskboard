/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  '@global': {
    li: {
      listStyle: 'none',
    },
  },
  containerClassName: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  pageClassName: {
    cursor: 'pointer',
    display: 'inline-block',
    borderRadius: '2px',
    textAlign: 'center',
    verticalAlign: 'top',
    height: '30px',

    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    zIndex: '1',
    transition: '.3s ease-out',

    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#ee6e73',
    },
  },
  pageLinkClassName: {
    display: 'inline-block',
    fontSize: '1.2rem',
    padding: '0 10px',
    lineHeight: '30px',
  },
  activeClassName: {
    backgroundColor: '#ee6e73',
  },
  activeLinkClassName: {
    color: '#fff',
  },
  prevNextClassName: {},
  prevNextLinkClassName: {},
  disabledClassName: {
    cursor: 'default',
    color: '#999',
  },
}));

function Pagination(props) {
  const classes = useStyles();
  const pageCount = Math.ceil(props.count / props.limit);
  const currentPage = !!props.offset ? Math.floor(props.count / props.offset) : 0;

  return (
    <ReactPaginate
      forcePage={currentPage}
      previousLabel={' ← '}
      nextLabel={' → '}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={props.onPageChange}
      containerClassName={classes.containerClassName}
      pageClassName={classes.pageClassName}
      pageLinkClassName={classes.pageLinkClassName}
      activeClassName={classes.activeClassName}
      activeLinkClassName={classes.activeLinkClassName}
      previousClassName={classes.pageClassName}
      nextClassName={classes.pageClassName}
      previousLinkClassName={classes.pageLinkClassName}
      nextLinkClassName={classes.pageLinkClassName}
      breakClassName={classes.pageClassName}
      breakLinkClassName={classes.pageLinkClassName}
      disabledClassName={classes.disabledClassName}
    />
  );
}

Pagination.propTypes = {
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
