import { FormGroup, styled, type Theme } from '@material-ui/core';
import { useCallback, type FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import IntegerInput from '../integer-input';
import {
  imageIsDefaultState,
  labelIndexState,
  labelIsDefaultState,
  modelIsDefaultState,
} from '../../utils/form';

interface LabelControlProps {
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

const LabelControl: FC<LabelControlProps> = () => {
  const setImageIsDefault = useSetRecoilState(imageIsDefaultState);
  const setModelIsDefault = useSetRecoilState(modelIsDefaultState);
  const [isDefault, setIsDefault] = useRecoilState(labelIsDefaultState);
  const [index, setIndex] = useRecoilState(labelIndexState);
  const handleChange = useCallback(
    (value: boolean) => {
      if (!value) {
        setImageIsDefault(false);
        setModelIsDefault(false);
      }
      setIsDefault(value);
    },
    [setImageIsDefault, setIsDefault, setModelIsDefault],
  );
  return (
    <StyledFormGroup row={true}>
      <StyledControlLabel value={'Label'} variant={'subtitle1'} />
      <CustomDefaultSwitch onChange={handleChange} value={isDefault} />
      <StyledIntegerInput
        description={'correspond to the classification'}
        hidden={isDefault}
        min={0}
        onChange={setIndex}
        value={index}
      />
    </StyledFormGroup>
  );
};

export { LabelControl as default };
