import type { FC } from 'react';
import title from './title.svg';

interface TitlePicProps {
  className?: string;
}

const TitlePic: FC<TitlePicProps> = (props) => {
  const { className } = props;
  return <img alt={'title'} className={className ?? ''} src={title} />;
};

export default TitlePic;
