import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
    color: '#777',
    margin: theme.spacing(1, 1.5),
  },
  profile: {
    color: '#777',
  },
  accountCircle: {
    color: '#777',
    marginLeft: theme.spacing(1),
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  return (
    <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" noWrap className={classes.toolbarTitle}>
          Task Board
        </Typography>
        <nav>
          <Button
            href="/users/bob" // TODO
            className={classes.profile}
          >
            Bob
            <AccountCircle className={classes.accountCircle} />
          </Button>
          <Button href="/accounts/logout/" className={classes.link}>
            Sign Out
          </Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
}
