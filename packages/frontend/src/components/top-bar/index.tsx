import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from 'react';
import type { FC } from 'react';
import LogoPic from '../logo-pic';
import RepoIcon from '../repo-icon';
import TitlePic from '../title-pic';

interface TopBarProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    padding: 12,
    height: 56,
  },
  title: {
    height: 34.5,
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      height: 23,
    },
  },
}));

const TopBar: FC<TopBarProps> = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <AppBar color={'primary'} position={'fixed'}>
        <Toolbar className={classes.root}>
          <LogoPic className={classes.logo} />
          <TitlePic className={classes.title} />
          <RepoIcon />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  );
};

export default TopBar;