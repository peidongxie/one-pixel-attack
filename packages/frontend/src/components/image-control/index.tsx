import { FormGroup, styled, type Theme } from '@material-ui/core';
import { useCallback, type FC } from 'react';
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

const extensions = ['npy', 'png'];

interface StyledRawNormalizedSwitchProps {
  hidden: boolean;
}

const StyledRawNormalizedSwitch = styled<
  FC<Parameters<typeof RawNormalizedSwitch>[0] & StyledRawNormalizedSwitchProps>
>(RawNormalizedSwitch)<Theme, StyledRawNormalizedSwitchProps>(({ hidden }) => ({
  visibility: hidden ? 'hidden' : 'visible',
}));

const ImageControl: FC<ImageControlProps> = () => {
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
      setModelIsDefault(value);
      if (value) setLabelIsDefault(true);
    },
    [setIsDefault, setLabelIsDefault, setModelIsDefault],
  );
  return (
    <StyledFormGroup row={true}>
      <StyledControlLabel value={'Image'} variant={'subtitle1'} />
      <CustomDefaultSwitch onChange={handleChange} value={isDefault} />
      <StyledFileUploader
        extensions={extensions}
        hidden={isDefault}
        onChange={setFile}
        value={file}
      />
      <StyledRawNormalizedSwitch
        hidden={isDefault || !isNumpy}
        onChange={setIsNormalized}
        value={isNormalized}
      />
    </StyledFormGroup>
  );
};

export { ImageControl as default };
