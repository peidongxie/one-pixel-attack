import { IconButton } from '@material-ui/core';
import { GitHub as GitHubIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { type FC } from 'react';

interface RepoIconProps {
  className?: string;
}

const RepoIcon: FC<RepoIconProps> = (props) => {
  const { className } = props;
  return (
    <IconButton
      aria-label={'GitHub'}
      className={clsx(className)}
      color={'inherit'}
      href={'https://github.com/peidongxie/one-pixel-attack'}
    >
      <GitHubIcon />
    </IconButton>
  );
};

export default RepoIcon;
