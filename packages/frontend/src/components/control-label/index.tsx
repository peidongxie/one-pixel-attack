import Typography from '@material-ui/core/Typography';
import type { TypographyProps } from '@material-ui/core/Typography';
import type { FC } from 'react';

interface ControlLabelProps {
  className?: string;
  value: string;
  variant?: TypographyProps['variant'];
}

const ControlLabel: FC<ControlLabelProps> = (props) => {
  const { className, value, variant } = props;
  return (
    <Typography className={className ?? ''} variant={variant ?? 'inherit'}>
      {value}
    </Typography>
  );
};

export default ControlLabel;