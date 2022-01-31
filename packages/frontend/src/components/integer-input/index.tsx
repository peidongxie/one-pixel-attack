import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
  type InputProps,
} from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useCallback, useMemo, useState, type FC } from 'react';

interface IntegerInputProps {
  className?: string;
  description?: string;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}

const StyledOutlinedInput = styled(OutlinedInput)({
  '& > input': {
    width: 64,
    padding: 8,
    height: 20,
    textAlign: 'center',
  },
});

const StyledFormHelperText = styled(FormHelperText)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const IntegerInput: FC<IntegerInputProps> = (props) => {
  const { className, description, min, onChange, value } = props;
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
      <StyledOutlinedInput
        endAdornment={endAdornment}
        onBlur={handleBlur}
        onChange={handleChange}
        startAdornment={startAdornment}
        value={text}
      />
      <StyledFormHelperText>{description}</StyledFormHelperText>
    </FormControl>
  );
};

export { IntegerInput as default };
