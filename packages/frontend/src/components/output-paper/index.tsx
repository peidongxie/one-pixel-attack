import { Paper, styled } from '@material-ui/core';
import { type FC } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import PredictionChart from '../prediction-chart';
import ImageCanvas from '../image-canvas';
import {
  imagesState,
  predictionsState,
  queryIdState,
  queryOutputState,
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
  const id = useRecoilValue(queryIdState);
  const output = useRecoilValueLoadable(queryOutputState(id));
  const images = useRecoilValueLoadable(imagesState(id));
  const predictions = useRecoilValueLoadable(predictionsState(id));
  if (output.state !== 'hasValue' || output.contents === null) {
    return null;
  }
  return (
    <StyledPaper>
      <StyledImageCanvas image={images.contents[0]} />
      <StyledImageCanvas image={images.contents[1]} />
      <StyledPredictionChart predictions={predictions.contents} />
    </StyledPaper>
  );
};

export { OutputPaper as default };
