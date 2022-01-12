import clsx from 'clsx';
import { type FC } from 'react';

interface TitlePicProps {
  className?: string;
}

const TitlePic: FC<TitlePicProps> = (props) => {
  const { className } = props;
  return (
    <img alt={'title'} className={clsx(className)} src={'/static/title.svg'} />
  );
};

export { TitlePic as default };
