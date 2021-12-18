import { FormGroup, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useCallback, type FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import IntegerInput from '../integer-input';
import {
  imageIsDefaultState,
  labelIndexState,
  labelIsDefaultState,
  modelIsDefaultState,
} from '../../utils/form';

interface LabelControlProps {
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
  index: {
    margin: theme.spacing(0, 1),
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const LabelControl: FC<LabelControlProps> = () => {
  const classes = useStyles();
  const setImageIsDefault = useSetRecoilState(imageIsDefaultState);
  const setModelIsDefault = useSetRecoilState(modelIsDefaultState);
  const [isDefault, setIsDefault] = useRecoilState(labelIsDefaultState);
  const [index, setIndex] = useRecoilState(labelIndexState);
  const handleChange = useCallback(
    (value: boolean) => {
      if (!value) {
        setImageIsDefault(false);
        setModelIsDefault(false);
      }
      setIsDefault(value);
    },
    [setImageIsDefault, setIsDefault, setModelIsDefault],
  );
  return (
    <FormGroup className={classes.root} row={true}>
      <ControlLabel
        className={classes.label}
        value={'Label'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch onChange={handleChange} value={isDefault} />
      <IntegerInput
        className={clsx(classes.index, isDefault && classes.hidden)}
        description={'correspond to the classification'}
        min={0}
        onChange={setIndex}
        value={index}
      />
    </FormGroup>
  );
};

export default LabelControl;
