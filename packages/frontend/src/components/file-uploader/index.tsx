import {
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
} from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useCallback, useMemo, type ChangeEventHandler, type FC } from 'react';

interface FileUploaderProps {
  className?: string;
  extensions: string[];
  onChange: (file: File | null) => void;
  value: File | null;
}

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const FileUploader: FC<FileUploaderProps> = (props) => {
  const { className, extensions, onChange, value } = props;
  const classes = useStyles();
  const accept = useMemo(() => {
    const text = extensions
      .map((extension) => '.' + extension.toLowerCase())
      .join(',');
    return text;
  }, [extensions]);
  const helperText = useMemo(() => {
    if (value) return 'file: ' + value.name;
    const text = extensions
      .map((extension) => extension.toUpperCase())
      .join('/');
    return `allow a ${text} file`;
  }, [extensions, value]);
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange(e.target.files?.item(0) ?? null);
    },
    [onChange],
  );
  return (
    <FormControl className={clsx(className)} component={'label'}>
      <Button
        color={'primary'}
        component={'span'}
        startIcon={<CloudUploadIcon />}
        variant={'contained'}
      >
        {'Upload'}
      </Button>
      <input
        accept={accept}
        className={classes.input}
        onChange={handleChange}
        type={'file'}
      />
      <FormHelperText className={classes.text}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default FileUploader;
