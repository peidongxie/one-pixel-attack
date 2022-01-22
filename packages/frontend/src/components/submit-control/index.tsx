import {
  Button,
  CircularProgress,
  FormGroup,
  makeStyles,
} from '@material-ui/core';
import { useState, type FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { formState, isValidState, resultState } from '../../utils/form';

interface SubmitControlProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0.5, 0),
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
  },
  submit: {
    height: 38,
    width: 88,
  },
}));

const SubmitControl: FC<SubmitControlProps> = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const isVaild = useRecoilValue(isValidState);
  const handleClick = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const form = await snapshot.getPromise(formState);
        if (form !== null) {
          setLoading(true);
          const formData = new FormData();
          for (const { name, value, fileName } of form) {
            if (fileName) formData.append(name, value, fileName);
            else formData.append(name, value);
          }
          try {
            const response = await fetch('http://localhost:3001/', {
              body: formData,
              method: 'POST',
            });
            const result = await response.json();
            set(resultState, result);
          } catch (e) {
            console.error(e);
          }
          setLoading(false);
        }
      },
    [],
  );
  return (
    <FormGroup className={classes.root} row={true}>
      <Button
        aria-label={'Attack'}
        className={classes.submit}
        color={'secondary'}
        disabled={!isVaild || loading}
        onClick={handleClick}
        variant={'contained'}
      >
        {loading ? <CircularProgress size={20} thickness={1.8} /> : 'Attack'}
      </Button>
    </FormGroup>
  );
};

export { SubmitControl as default };
