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
  const [isDefault, setIsDefault] = useRecoilState(labelIsDefaultState);
  const [index, setIndex] = useRecoilState(labelIndexState);
  return (
    <FormGroup className={classes.root} row={true}>
      <ControlLabel
        className={classes.label}
        value={'Label'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch onChange={setIsDefault} value={isDefault} />
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
