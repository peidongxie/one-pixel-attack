import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import type { InputProps } from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import type { FC } from 'react';

interface IntegerInputProps {
  className?: string;
  description?: string;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}

const useStyles = makeStyles(() => ({
  input: {
    width: 64,
    padding: 8,
    height: 20,
    textAlign: 'center',
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const IntegerInput: FC<IntegerInputProps> = (props) => {
  const { className, description, min, onChange, value } = props;
  const classes = useStyles();
  const inputClasses = useMemo(
    () => ({
      input: classes.input,
    }),
    [classes],
  );
  const minValue = useMemo(() => (min === undefined ? -Infinity : min), [min]);
  const [text, setText] = useState(value === null ? '' : String(value));
  const fixValue = useCallback(
    (value: number) => (!isNaN(value) && value < minValue ? minValue : value),
    [minValue],
  );
  const handleChange = useCallback<NonNullable<InputProps['onChange']>>(
    (e) => {
      const text = e.target.value;
      const newValue = fixValue(parseInt(text));
      const newText = text;
      setText(newText);
      onChange(newValue);
    },
    [fixValue, onChange],
  );
  const handleBlur = useCallback<NonNullable<InputProps['onBlur']>>(
    (e) => {
      const text = e.target.value;
      const newValue = fixValue(parseInt(text));
      const newText = isNaN(newValue) ? '' : String(newValue);
      setText(newText);
      onChange(newValue);
    },
    [fixValue, onChange],
  );
  const handleClickStart = useCallback(() => {
    const newValue = fixValue(value - 1);
    const newText = isNaN(newValue) ? '' : String(newValue);
    setText(newText);
    onChange(newValue);
  }, [fixValue, onChange, value]);
  const handleClickEnd = useCallback(() => {
    const newValue = fixValue(value + 1);
    const newText = isNaN(newValue) ? '' : String(newValue);
    setText(newText);
    onChange(newValue);
  }, [fixValue, onChange, value]);
  const startAdornment = (
    <InputAdornment position={'start'}>
      <IconButton onClick={handleClickStart} size={'small'}>
        <RemoveIcon />
      </IconButton>
    </InputAdornment>
  );
  const endAdornment = (
    <InputAdornment onClick={handleClickEnd} position={'end'}>
      <IconButton size={'small'}>
        <AddIcon />
      </IconButton>
    </InputAdornment>
  );
  return (
    <FormControl className={clsx(className)} component={'label'}>
      <OutlinedInput
        classes={inputClasses}
        endAdornment={endAdornment}
        onBlur={handleBlur}
        onChange={handleChange}
        startAdornment={startAdornment}
        value={text}
      />
      <FormHelperText className={classes.text}>{description}</FormHelperText>
    </FormControl>
  );
};

export default IntegerInput;
