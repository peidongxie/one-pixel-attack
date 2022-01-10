import { Paper, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
import { useRecoilValue } from 'recoil';
import PredictionChart from '../prediction-chart';
import ImageCanvas from '../image-canvas';
import {
  imageBeforeState,
  imageAfterState,
  resultState,
} from '../../utils/form';

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
  const imageBefore = useRecoilValue(imageBeforeState);
  const imageAfter = useRecoilValue(imageAfterState);
  return (
    <Paper className={classes.root}>
      <ImageCanvas image={imageBefore} />
      <ImageCanvas image={imageAfter} />
      <PredictionChart predictions={result?.predictions || null} />
    </Paper>
  );
};

export { OutputPaper as default };
