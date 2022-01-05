import { Paper, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
import { useRecoilValue } from 'recoil';
import ImageCanvas from '../image-canvas';
import {
  imageBeforeState,
  imageAfterState,
  shapeState,
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
  const imageBefore = useRecoilValue(imageBeforeState);
  const imageAfter = useRecoilValue(imageAfterState);
  const shape = useRecoilValue(shapeState);
  return (
    <Paper className={classes.root}>
      <ImageCanvas image={imageBefore} shape={shape} />
      <ImageCanvas image={imageAfter} shape={shape} />
    </Paper>
  );
};

export { OutputPaper as default };
