import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import type { FC } from 'react';
import { useRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import IntegerInput from '../integer-input';
import { labelIndexState, labelIsDefaultState } from '../../utils/form';

interface LabelControlProps {
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
  hidden: {
    visibility: 'hidden',
  },
}));

const LabelControl: FC<LabelControlProps> = () => {
  const classes = useStyles();
  const [isDefault, setIsDefault] = useRecoilState(labelIsDefaultState);
  const [index, setIndex] = useRecoilState(labelIndexState);
  return (
    <FormGroup row={true}>
      <ControlLabel
        className={classes.label}
        value={'Label'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch
        className={clsx()}
        onChange={setIsDefault}
        value={isDefault}
      />
      <IntegerInput
        className={clsx(isDefault && classes.hidden)}
        description={'correspond to the classification'}
        min={0}
        onChange={setIndex}
        value={index}
      />
    </FormGroup>
  );
};

export default LabelControl;
