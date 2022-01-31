import { Button, CircularProgress, FormGroup, styled } from '@material-ui/core';
import { useState, type FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { formState, isValidState, resultState } from '../../utils/form';

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
    <StyledFormGroup row={true}>
      <StyledButton
        aria-label={'Attack'}
        color={'secondary'}
        disabled={!isVaild || loading}
        onClick={handleClick}
        variant={'contained'}
      >
        {loading ? <CircularProgress size={20} thickness={1.8} /> : 'Attack'}
      </StyledButton>
    </StyledFormGroup>
  );
};

export { SubmitControl as default };
