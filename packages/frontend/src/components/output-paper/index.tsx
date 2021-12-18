import { Paper, makeStyles } from '@material-ui/core';
import { type FC } from 'react';

interface OutputPaperProps {
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    height: 'fit-content',
    width: 'fit-content',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 0),
      marginTop: theme.spacing(0),
      flexGrow: 1,
    },
  },
}));

const OutputPaper: FC<OutputPaperProps> = () => {
  const classes = useStyles();
  return <Paper className={classes.root}></Paper>;
};

export default OutputPaper;
