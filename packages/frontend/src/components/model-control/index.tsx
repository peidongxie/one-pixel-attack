import { FormGroup, styled, type Theme } from '@material-ui/core';
import { useCallback, type FC } from 'react';
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

const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  flexWrap: 'nowrap',
}));

const StyledControlLabel = styled(ControlLabel)(({ theme }) => ({
  padding: theme.spacing(0.75, 2),
  height: 36,
  minWidth: 122,
  textAlign: 'end',
}));

interface StyledFileUploaderProps {
  hidden: boolean;
}

const StyledFileUploader = styled<
  FC<Parameters<typeof FileUploader>[0] & StyledFileUploaderProps>
>(FileUploader)<Theme, StyledFileUploaderProps>(({ hidden, theme }) => ({
  minWidth: 122,
  margin: theme.spacing(0, 1),
  visibility: hidden ? 'hidden' : 'visible',
}));

const extensions = ['h5'];

interface StyledRawNormalizedSwitchProps {
  hidden: boolean;
}

const StyledRawNormalizedSwitch = styled<
  FC<Parameters<typeof RawNormalizedSwitch>[0] & StyledRawNormalizedSwitchProps>
>(RawNormalizedSwitch)<Theme, StyledRawNormalizedSwitchProps>(({ hidden }) => ({
  visibility: hidden ? 'hidden' : 'visible',
}));

const ModelControl: FC<ModelControlProps> = () => {
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
    <StyledFormGroup row={true}>
      <StyledControlLabel value={'Model'} variant={'subtitle1'} />
      <CustomDefaultSwitch onChange={handleChange} value={isDefault} />
      <StyledFileUploader
        extensions={extensions}
        hidden={isDefault}
        onChange={setFile}
        value={file}
      />
      <StyledRawNormalizedSwitch
        hidden={isDefault}
        onChange={setIsNormalized}
        value={isNormalized}
      />
    </StyledFormGroup>
  );
};

export { ModelControl as default };
