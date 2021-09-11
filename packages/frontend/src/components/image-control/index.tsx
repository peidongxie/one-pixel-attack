import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import type { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import FileUploader from '../file-uploader';
import RawNormalizedSwitch from '../raw-normalized-switch';
import {
  imageFileState,
  imageIsDefaultState,
  imageIsNormalizedState,
  imageIsNumpyState,
} from '../../utils/form';

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
  file: {
    width: 128,
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const extensions = ['npy', 'png'];

const ImageControl: FC<ImageControlProps> = () => {
  const classes = useStyles();
  const [isDefault, setIsDefault] = useRecoilState(imageIsDefaultState);
  const [file, setFile] = useRecoilState(imageFileState);
  const [isNormalized, setIsNormalized] = useRecoilState(
    imageIsNormalizedState,
  );
  const isNumpy = useRecoilValue(imageIsNumpyState);
  return (
    <FormGroup row={true}>
      <ControlLabel
        className={classes.label}
        value={'Image'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch
        className={clsx()}
        onChange={setIsDefault}
        value={isDefault}
      />
      <FileUploader
        className={clsx(classes.file, isDefault && classes.hidden)}
        extensions={extensions}
        onChange={setFile}
        value={file}
      />
      <RawNormalizedSwitch
        className={clsx((isDefault || !isNumpy) && classes.hidden)}
        onChange={setIsNormalized}
        value={isNormalized}
      />
    </FormGroup>
  );
};

export default ImageControl;
