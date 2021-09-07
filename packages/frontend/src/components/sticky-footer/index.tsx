import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import type { FC } from 'react';
import Copyright from '../copyright';
import AuthorLink from '../author-link';

interface StickyFooterProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    textAlign: 'center',
  },
}));

const StickyFooter: FC<StickyFooterProps> = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root} component={'footer'} maxWidth={false}>
      <Typography variant={'body2'} color={'textSecondary'}>
        <Copyright startYear={2019} /> <AuthorLink />
      </Typography>
    </Container>
  );
};

export default StickyFooter;
