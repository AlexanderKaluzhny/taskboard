import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  appBar: {
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    color: '#777',
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    margin: '0 4em',
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" noWrap className={classes.toolbarTitle}>
          Task Board
        </Typography>
        <nav>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            href="/users/bob" // TODO
          >
            <AccountCircle />
          </IconButton>
          <Button
            href="/accounts/logout/"
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            Sign Out
          </Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
}