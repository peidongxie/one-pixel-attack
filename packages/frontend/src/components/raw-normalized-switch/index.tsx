import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import type { SwitchProps } from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import type { FC } from 'react';
import ControlLabel from '../control-label';

interface RawNormalizedSwitchProps {
  className?: string;
  initValue: boolean;
  onChange: (value: boolean) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'fit-content',
    margin: theme.spacing(0),
  },
  control: {
    marginLeft: theme.spacing(0.5),
  },
  label: {
    width: 116,
  },
}));

const RawNormalizedSwitch: FC<RawNormalizedSwitchProps> = (props) => {
  const { className, initValue, onChange } = props;
  const classes = useStyles();
  const [value, setValue] = useState(initValue);
  const handleChange = useCallback<NonNullable<SwitchProps['onChange']>>(
    (event, checked) => {
      setValue(checked);
      onChange(checked);
    },
    [onChange],
  );
  const control = (
    <Switch
      checked={value}
      className={classes.control}
      color={'primary'}
      onChange={handleChange}
    />
  );
  const label = (
    <ControlLabel
      className={classes.label}
      value={value ? 'Normalized(0-1)' : 'Raw(0-255)'}
      variant={'body2'}
    />
  );
  return (
    <FormControlLabel
      className={clsx(classes.root, className)}
      control={control}
      label={label}
    />
  );
};

export default RawNormalizedSwitch;
