import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useCallback } from 'react';
import type { FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import FileUploader from '../file-uploader';
import RawNormalizedSwitch from '../raw-normalized-switch';
import {
  imageFileState,
  imageIsDefaultState,
  imageIsNormalizedState,
  imageIsNumpyState,
  labelIsDefaultState,
  modelIsDefaultState,
} from '../../utils/form';

interface ImageControlProps {
  [key: string]: never;
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5, 0),
    flexWrap: 'nowrap',
  },
  label: {
    padding: theme.spacing(0.75, 2),
    height: 36,
    width: 120,
    textAlign: 'end',
  },
  default: {
    margin: theme.spacing(0, 1),
  },
  file: {
    width: 128,
    margin: theme.spacing(0, 1),
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const extensions = ['npy', 'png'];

const ImageControl: FC<ImageControlProps> = () => {
  const classes = useStyles();
  const [isDefault, setIsDefault] = useRecoilState(imageIsDefaultState);
  const setModelIsDefault = useSetRecoilState(modelIsDefaultState);
  const setLabelIsDefault = useSetRecoilState(labelIsDefaultState);
  const [file, setFile] = useRecoilState(imageFileState);
  const [isNormalized, setIsNormalized] = useRecoilState(
    imageIsNormalizedState,
  );
  const isNumpy = useRecoilValue(imageIsNumpyState);
  const handleChange = useCallback(
    (value: boolean) => {
      setIsDefault(value);
      if (value) {
        setModelIsDefault(true);
        setLabelIsDefault(true);
      }
    },
    [setIsDefault, setLabelIsDefault, setModelIsDefault],
  );
  return (
    <FormGroup className={classes.root} row={true}>
      <ControlLabel
        className={classes.label}
        value={'Image'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch onChange={handleChange} value={isDefault} />
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
