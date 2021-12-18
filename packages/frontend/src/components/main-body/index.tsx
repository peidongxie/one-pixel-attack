import { Box, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
import InputPaper from '../input-paper';
import OutputPaper from '../output-paper';

interface MainBodyProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    },
  },
}));

const MainBody: FC<MainBodyProps> = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root} component={'main'}>
      <InputPaper />
      <OutputPaper />
    </Box>
  );
};

export default MainBody;
