import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import type { SwitchProps } from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useState } from 'react';
import type { FC } from 'react';
import ControlLabel from '../control-label';

interface CustomDefaultSwitchProps {
  initValue: boolean;
  onChange: (value: boolean) => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'fit-content',
    margin: theme.spacing(0, 1),
  },
  control: {
    marginLeft: theme.spacing(0.5),
  },
  label: {
    width: 60,
  },
}));

const CustomDefaultSwitch: FC<CustomDefaultSwitchProps> = (props) => {
  const { initValue, onChange } = props;
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
      value={value ? 'Default' : 'Custom'}
      variant={'body2'}
    />
  );
  return (
    <FormControlLabel
      className={classes.root}
      control={control}
      label={label}
    />
  );
};

export default CustomDefaultSwitch;
