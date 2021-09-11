import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import type { FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import FileUploader from '../file-uploader';
import RawNormalizedSwitch from '../raw-normalized-switch';
import {
  modelFileState,
  modelIsDefaultState,
  modelIsNormalizedState,
} from '../../utils/form';

interface ModelControlProps {
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

const extensions = ['h5'];

const ModelControl: FC<ModelControlProps> = () => {
  const classes = useStyles();
  const [isDefault, setIsDefault] = useRecoilState(modelIsDefaultState);
  const setImageFile = useSetRecoilState(modelFileState);
  const [isNormalized, setIsNormalized] = useRecoilState(
    modelIsNormalizedState,
  );
  return (
    <FormGroup row={true}>
      <ControlLabel
        className={classes.label}
        value={'Model'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch initValue={isDefault} onChange={setIsDefault} />
      <FileUploader
        className={clsx(classes.file, isDefault && classes.hidden)}
        extensions={extensions}
        onChange={setImageFile}
      />
      <RawNormalizedSwitch
        className={clsx(isDefault && classes.hidden)}
        initValue={isNormalized}
        onChange={setIsNormalized}
      />
    </FormGroup>
  );
};

export default ModelControl;
