import { Link } from '@material-ui/core';
import clsx from 'clsx';
import { type FC } from 'react';

interface AuthorLinkProps {
  className?: string;
}

const AuthorLink: FC<AuthorLinkProps> = (props) => {
  const { className } = props;
  return (
    <Link
      className={clsx(className)}
      color={'inherit'}
      href={'https://github.com/peidongxie'}
    >
      {'谢沛东'}
    </Link>
  );
};

export default AuthorLink;
