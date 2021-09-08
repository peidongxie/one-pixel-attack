import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useState } from 'react';
import type { FC } from 'react';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import FileUploader from '../file-uploader';

interface ImageControlProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    padding: theme.spacing(0.75, 2),
    height: 36,
    width: 100,
    textAlign: 'end',
  },
}));

const ImageControl: FC<ImageControlProps> = () => {
  const classes = useStyles();
  const [isDefault, setIsDefault] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const handleChangeIsDefault = useCallback((value: boolean) => {
    setIsDefault(value);
  }, []);
  const handleChangeFile = useCallback((value: File | null) => {
    setFile(value);
  }, []);
  return (
    <FormGroup row={true}>
      <ControlLabel
        className={classes.label}
        value={'Image'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch initValue={true} onChange={handleChangeIsDefault} />
      <FileUploader hidden={isDefault} onChange={handleChangeFile} />
    </FormGroup>
  );
};

export default ImageControl;
