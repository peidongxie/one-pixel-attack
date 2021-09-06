import type { FC } from 'react';
import logo from './logo.svg';

interface LogoPicProps {
  className?: string;
}

const LogoPic: FC<LogoPicProps> = (props) => {
  const { className } = props;
  return <img alt={'logo'} className={className ?? ''} src={logo} />;
};

export default LogoPic;
