import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useCallback, useState } from 'react';
import type { ChangeEventHandler, FC } from 'react';

interface FileUploaderProps {
  hidden?: boolean;
  onChange: (file: File | null) => void;
}

const useStyles = makeStyles(() => ({
  file: {
    display: 'none',
  },
  visible: {
    visibility: 'visible',
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const FileUploader: FC<FileUploaderProps> = (props) => {
  const { hidden, onChange } = props;
  const classes = useStyles();
  const [text, setText] = useState('allow a NPY or PNG file');
  const handleSelectFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const file = e.target.files?.item(0);
      setText(file ? 'file: ' + file.name : 'allow a NPY or PNG file');
      onChange(file ?? null);
    },
    [onChange],
  );
  return (
    <FormControl
      className={hidden ? classes.hidden : classes.visible}
      component={'label'}
    >
      <Button
        color={'primary'}
        component={'span'}
        startIcon={<CloudUploadIcon />}
        variant={'contained'}
      >
        {'Upload'}
      </Button>
      <input
        accept={'.npy,.png'}
        className={classes.file}
        onChange={handleSelectFile}
        type={'file'}
      />
      <FormHelperText>{text}</FormHelperText>
    </FormControl>
  );
};

export default FileUploader;
