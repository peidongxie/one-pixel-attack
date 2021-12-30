import { Typography, type TypographyProps } from '@material-ui/core';
import clsx from 'clsx';
import { type FC } from 'react';

interface ControlLabelProps {
  className?: string;
  value: string;
  variant?: TypographyProps['variant'];
}

const ControlLabel: FC<ControlLabelProps> = (props) => {
  const { className, value, variant } = props;
  return (
    <Typography className={clsx(className)} variant={variant ?? 'inherit'}>
      {value}
    </Typography>
  );
};

export { ControlLabel as default };
