import { Button, FormControl, FormHelperText, styled } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useCallback, useMemo, type ChangeEventHandler, type FC } from 'react';

interface FileUploaderProps {
  className?: string;
  extensions: string[];
  onChange: (file: File | null) => void;
  value: File | null;
}

const StyledInput = styled('input')({
  display: 'none',
});

const StyledFormHelperText = styled(FormHelperText)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const FileUploader: FC<FileUploaderProps> = (props) => {
  const { className, extensions, onChange, value } = props;
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
      <StyledInput accept={accept} onChange={handleChange} type={'file'} />
      <StyledFormHelperText>{helperText}</StyledFormHelperText>
    </FormControl>
  );
};

export { FileUploader as default };
