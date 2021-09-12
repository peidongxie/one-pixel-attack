import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import type { SwitchProps } from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useCallback } from 'react';
import type { FC } from 'react';
import ControlLabel from '../control-label';

interface RawNormalizedSwitchProps {
  className?: string;
  onChange: (value: boolean) => void;
  value: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'fit-content',
    margin: theme.spacing(0),
  },
  control: {
    marginTop: -1,
    marginBottom: -1,
  },
  label: {
    width: 108,
    marginRight: theme.spacing(1.5),
  },
}));

const RawNormalizedSwitch: FC<RawNormalizedSwitchProps> = (props) => {
  const { className, onChange, value } = props;
  const classes = useStyles();
  const handleChange = useCallback<NonNullable<SwitchProps['onChange']>>(
    (event, checked) => {
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
      value={value ? 'Normalized (0-1)' : 'Raw (0-255)'}
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
