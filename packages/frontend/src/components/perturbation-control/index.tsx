import { FormGroup, styled, type Theme } from '@material-ui/core';
import { type FC } from 'react';
import { useRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import IntegerInput from '../integer-input';
import {
  perturbationIsDefaultState,
  perturbationPixelState,
} from '../../utils/form';

interface PerturbationControlProps {
  [key: string]: never;
}

const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  flexWrap: 'nowrap',
}));

const StyledControlLabel = styled(ControlLabel)(({ theme }) => ({
  padding: theme.spacing(0.75, 2),
  height: 36,
  minWidth: 122,
  textAlign: 'end',
}));

interface StyledIntegerInputProps {
  hidden: boolean;
}

const StyledIntegerInput = styled<
  FC<Parameters<typeof IntegerInput>[0] & StyledIntegerInputProps>
>(IntegerInput)<Theme, StyledIntegerInputProps>(({ hidden, theme }) => ({
  minWidth: 184,
  margin: theme.spacing(0, 1),
  visibility: hidden ? 'hidden' : 'visible',
}));

const PerturbationControl: FC<PerturbationControlProps> = () => {
  const [isDefault, setIsDefault] = useRecoilState(perturbationIsDefaultState);
  const [pixel, setPixel] = useRecoilState(perturbationPixelState);
  return (
    <StyledFormGroup row={true}>
      <StyledControlLabel value={'Perturbation'} variant={'subtitle1'} />
      <CustomDefaultSwitch onChange={setIsDefault} value={isDefault} />
      <StyledIntegerInput
        description={'number of affected pixels'}
        hidden={isDefault}
        min={1}
        onChange={setPixel}
        value={pixel}
      />
    </StyledFormGroup>
  );
};

export { PerturbationControl as default };
