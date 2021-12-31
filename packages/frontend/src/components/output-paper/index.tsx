import { Paper, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
import { useRecoilValue } from 'recoil';
import { resultState } from '../../utils/form';

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
  const result = useRecoilValue(resultState);
  return <Paper className={classes.root}>{JSON.stringify(result)}</Paper>;
};

export { OutputPaper as default };
