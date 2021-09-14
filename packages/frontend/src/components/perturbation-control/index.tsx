import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import type { FC } from 'react';
import { useRecoilState } from 'recoil';
import ControlLabel from '../control-label';
import CustomDefaultSwitch from '../custom-default-switch';
import IntegerInput from '../integer-input';
import {
  perturbationIsDefaultState,
  perturbationPixelState,
} from '../../utils/form';

interface PerturbationControlProps {
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
  pixel: {
    margin: theme.spacing(0, 1),
  },
  hidden: {
    visibility: 'hidden',
  },
}));

const PerturbationControl: FC<PerturbationControlProps> = () => {
  const classes = useStyles();
  const [isDefault, setIsDefault] = useRecoilState(perturbationIsDefaultState);
  const [pixel, setPixel] = useRecoilState(perturbationPixelState);
  return (
    <FormGroup className={classes.root} row={true}>
      <ControlLabel
        className={classes.label}
        value={'Perturbation'}
        variant={'subtitle1'}
      />
      <CustomDefaultSwitch onChange={setIsDefault} value={isDefault} />
      <IntegerInput
        className={clsx(classes.pixel, isDefault && classes.hidden)}
        description={'number of affected pixels'}
        min={1}
        onChange={setPixel}
        value={pixel}
      />
    </FormGroup>
  );
};

export default PerturbationControl;
