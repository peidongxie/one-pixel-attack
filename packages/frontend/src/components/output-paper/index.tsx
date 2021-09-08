import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import type { FC } from 'react';

interface OutputPaperProps {
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    height: 'fit-content',
    width: 'fit-content',
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
  },
}));

const OutputPaper: FC<OutputPaperProps> = () => {
  const classes = useStyles();
  return <Paper className={classes.root}></Paper>;
};

export default OutputPaper;