import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import type { ChangeEventHandler, FC } from 'react';

interface FileUploaderProps {
  className?: string;
  extensions: string[];
  onChange: (file: File | null) => void;
  value: File | null;
}

const useStyles = makeStyles(() => ({
  file: {
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
        className={classes.file}
        onChange={handleChange}
        type={'file'}
      />
      <FormHelperText className={classes.text}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default FileUploader;
