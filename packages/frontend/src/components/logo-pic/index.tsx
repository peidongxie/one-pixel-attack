import clsx from 'clsx';
import { type FC } from 'react';

interface LogoPicProps {
  className?: string;
}

const LogoPic: FC<LogoPicProps> = (props) => {
  const { className } = props;
  return (
    <img alt={'logo'} className={clsx(className)} src={'/static/logo.svg'} />
  );
};

export { LogoPic as default };
