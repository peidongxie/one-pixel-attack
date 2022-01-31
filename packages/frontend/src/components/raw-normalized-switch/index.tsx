import {
  FormControlLabel,
  Switch,
  styled,
  type SwitchProps,
} from '@material-ui/core';
import clsx from 'clsx';
import { useCallback, type FC } from 'react';
import ControlLabel from '../control-label';

interface RawNormalizedSwitchProps {
  className?: string;
  onChange: (value: boolean) => void;
  value: boolean;
}

const StyledSwitch = styled(Switch)({
  marginTop: -1,
  marginBottom: -1,
});

const StyledControlLabel = styled(ControlLabel)(({ theme }) => ({
  width: 108,
  marginRight: theme.spacing(1.5),
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  height: 'fit-content',
  margin: theme.spacing(0),
}));

const RawNormalizedSwitch: FC<RawNormalizedSwitchProps> = (props) => {
  const { className, onChange, value } = props;
  const handleChange = useCallback<NonNullable<SwitchProps['onChange']>>(
    (event, checked) => {
      onChange(checked);
    },
    [onChange],
  );
  const control = (
    <StyledSwitch checked={value} color={'primary'} onChange={handleChange} />
  );
  const label = (
    <StyledControlLabel
      value={value ? 'Normalized (0-1)' : 'Raw (0-255)'}
      variant={'body2'}
    />
  );
  return (
    <StyledFormControlLabel
      className={clsx(className)}
      control={control}
      label={label}
    />
  );
};

export { RawNormalizedSwitch as default };
