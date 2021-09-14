import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import type { FC } from 'react';
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
          const response = await fetch('/', { body: formData, method: 'POST' });
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

export default SubmitControl;
