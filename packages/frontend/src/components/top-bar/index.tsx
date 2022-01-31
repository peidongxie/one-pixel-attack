import { AppBar, Toolbar, styled } from '@material-ui/core';
import { Fragment, type FC } from 'react';
import LogoPic from '../logo-pic';
import RepoIcon from '../repo-icon';
import TitlePic from '../title-pic';

interface TopBarProps {
  [key: string]: never;
}

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'center',
});

const StyledLogoPic = styled(LogoPic)({
  padding: 12,
  height: 56,
});

const StyledTitlePic = styled(TitlePic)(({ theme }) => ({
  height: 34.5,
  flexGrow: 1,
  [theme.breakpoints.down('xs')]: {
    height: 23,
  },
}));

const TopBar: FC<TopBarProps> = () => {
  return (
    <Fragment>
      <AppBar color={'primary'} position={'fixed'}>
        <StyledToolbar>
          <StyledLogoPic />
          <StyledTitlePic />
          <RepoIcon />
        </StyledToolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  );
};

export { TopBar as default };
