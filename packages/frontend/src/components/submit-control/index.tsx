import { Button, CircularProgress, FormGroup, styled } from '@material-ui/core';
import { type FC } from 'react';
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import {
  formState,
  queryIdState,
  queryInputState,
  queryOutputState,
} from '../../utils/form';

interface SubmitControlProps {
  [key: string]: never;
}

const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  margin: theme.spacing(0.5, 0),
  flexWrap: 'nowrap',
  justifyContent: 'flex-end',
}));

const StyledButton = styled(Button)({
  height: 38,
  width: 88,
});

const SubmitControl: FC<SubmitControlProps> = () => {
  const id = useRecoilValue(queryIdState);
  const output = useRecoilValueLoadable(queryOutputState(id));
  const form = useRecoilValue(formState);
  const handleClick = useRecoilCallback(
    ({ set }) =>
      () => {
        set(queryIdState, id + 1);
        set(queryInputState(id + 1), form);
      },
    [id, form],
  );
  return (
    <StyledFormGroup row={true}>
      <StyledButton
        aria-label={'Attack'}
        color={'secondary'}
        disabled={form === null || output.state === 'loading'}
        onClick={handleClick}
        variant={'contained'}
      >
        {output.state === 'loading' ? (
          <CircularProgress size={20} thickness={1.8} />
        ) : (
          'Attack'
        )}
      </StyledButton>
    </StyledFormGroup>
  );
};

export { SubmitControl as default };
