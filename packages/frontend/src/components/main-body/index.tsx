import { Box, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
import InputPaper from '../input-paper';
import OutputPaper from '../output-paper';

interface MainBodyProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(0.5),
    alignContent: 'flex-start',
    backgroundColor: theme.palette.grey[100],
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
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

export { MainBody as default };
