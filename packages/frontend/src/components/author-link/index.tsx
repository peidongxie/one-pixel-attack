import Link from '@material-ui/core/Link';
import type { FC } from 'react';

interface AuthorLinkProps {
  className?: string;
}

const AuthorLink: FC<AuthorLinkProps> = (props) => {
  const { className } = props;
  return (
    <Link
      className={className ?? ''}
      color={'inherit'}
      href={'https://github.com/peidongxie'}
    >
      {'谢沛东'}
    </Link>
  );
};

export default AuthorLink;
