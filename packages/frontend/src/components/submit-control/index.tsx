import { Button, FormGroup, makeStyles } from '@material-ui/core';
import { type FC } from 'react';
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
}));

const SubmitControl: FC<SubmitControlProps> = () => {
  const classes = useStyles();
  const isVaild = useRecoilValue(isValidState);
  const handleClick = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const form = await snapshot.getPromise(formState);
        if (form !== null) {
          const formData = new FormData();
          for (const { name, value, fileName } of form) {
            if (fileName) formData.append(name, value, fileName);
            else formData.append(name, value);
          }
          const response = await fetch(
            'https://run.mocky.io/v3/a92e320b-9e08-4481-9e39-ec713b92004f',
            { body: formData, method: 'POST' },
          );
          try {
            const result = await response.json();
            set(resultState, result);
          } catch (e) {
            console.error(e);
          }
        }
      },
    [],
  );
  return (
    <FormGroup className={classes.root} row={true}>
      <Button
        aria-label={'Attack'}
        color={'secondary'}
        disabled={!isVaild}
        onClick={handleClick}
        variant={'contained'}
      >
        {'Attack'}
      </Button>
    </FormGroup>
  );
};

export { SubmitControl as default };
