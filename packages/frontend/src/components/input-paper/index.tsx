import { Paper, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
import ImageControl from '../image-control';
import LabelControl from '../label-control';
import ModelControl from '../model-control';
import PerturbationControl from '../perturbation-control';
import SubmitControl from '../submit-control';

interface InputPaperProps {
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    height: 'fit-content',
    width: 'fit-content',
    maxWidth: '100%',
    margin: theme.spacing(2),
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
      margin: theme.spacing(0.5),
      flexGrow: 1,
    },
  },
}));

const InputPaper: FC<InputPaperProps> = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <ModelControl />
      <ImageControl />
      <LabelControl />
      <PerturbationControl />
      <SubmitControl />
    </Paper>
  );
};

export { InputPaper as default };
