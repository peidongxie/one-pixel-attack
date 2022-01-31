import { Paper, styled } from '@material-ui/core';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 'fit-content',
  width: 'fit-content',
  maxWidth: '100%',
  margin: theme.spacing(2, 2, 0, 2),
  overflow: 'auto',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    margin: theme.spacing(1, 1, 0, 1),
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1),
    margin: theme.spacing(0.5, 0.5, 0, 0.5),
    flexGrow: 1,
  },
}));

const StyledImageCanvas = styled(ImageCanvas)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const StyledPredictionChart = styled(PredictionChart)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const OutputPaper: FC<OutputPaperProps> = () => {
  const result = useRecoilValue(resultState);
  const imageBefore = useRecoilValue(imageBeforeState);
  const imageAfter = useRecoilValue(imageAfterState);
  if (!result) return null;
  return (
    <StyledPaper>
      <StyledImageCanvas image={imageBefore} />
      <StyledImageCanvas image={imageAfter} />
      <StyledPredictionChart predictions={result.predictions || null} />
    </StyledPaper>
  );
};

export { OutputPaper as default };
