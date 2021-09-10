import clsx from 'clsx';
import type { FC } from 'react';
import title from './title.svg';

interface TitlePicProps {
  className?: string;
}

const TitlePic: FC<TitlePicProps> = (props) => {
  const { className } = props;
  return <img alt={'title'} className={clsx(className)} src={title} />;
};

export default TitlePic;
