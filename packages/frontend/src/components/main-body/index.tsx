import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import type { FC } from 'react';
import InputPaper from '../input-paper';
import OutputPaper from '../output-paper';

interface MainBodyProps {
  [key: string]: never;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
}));

const MainBody: FC<MainBodyProps> = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root} component={'main'} maxWidth={false}>
      <InputPaper />
      <OutputPaper />
    </Container>
  );
};

export default MainBody;
