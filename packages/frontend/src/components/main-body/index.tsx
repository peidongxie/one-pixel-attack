import { Box, styled } from '@material-ui/core';
import { type FC } from 'react';
import InputPaper from '../input-paper';
import OutputPaper from '../output-paper';

interface MainBodyProps {
  [key: string]: never;
}

const StyledBox = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(0.5),
  alignContent: 'flex-start',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  flexGrow: 1,
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
}));

const MainBody: FC<MainBodyProps> = () => {
  return (
    <StyledBox component={'main'}>
      <InputPaper />
      <OutputPaper />
    </StyledBox>
  );
};

export { MainBody as default };
