import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useCallback } from 'react';
import type { FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import FileUploader from '../file-uploader';
import RawNormalizedSwitch from '../raw-normalized-switch';
import {
  imageIsDefaultState,
  labelIsDefaultState,
  modelFileState,
  modelIsDefaultState,
  modelIsNormalizedState,
} from '../../utils/form';

interface ModelControlProps {
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
  file: {
    width: 128,
    margin: theme.spacing(0, 1),
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const extensions = ['h5'];

const ModelControl: FC<ModelControlProps> = () => {
  const classes = useStyles();
  const setImageIsDefault = useSetRecoilState(imageIsDefaultState);
  const [isDefault, setIsDefault] = useRecoilState(modelIsDefaultState);
  const setLabelIsDefault = useSetRecoilState(labelIsDefaultState);
  const [file, setFile] = useRecoilState(modelFileState);
  const [isNormalized, setIsNormalized] = useRecoilState(
    modelIsNormalizedState,
  );
  const handleChange = useCallback(
    (value: boolean) => {
      setImageIsDefault(value);
      setIsDefault(value);
      if (value) setLabelIsDefault(true);
    },
    [setImageIsDefault, setLabelIsDefault, setIsDefault],
  );
  return (
    <FormGroup className={classes.root} row={true}>
      <ControlLabel
        className={classes.label}
        value={'Model'}
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
        className={clsx(isDefault && classes.hidden)}
        onChange={setIsNormalized}
        value={isNormalized}
      />
    </FormGroup>
  );
};

export default ModelControl;
