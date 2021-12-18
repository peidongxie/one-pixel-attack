import { Fragment, type FC } from 'react';

interface CopyrightProps {
  startYear?: number;
}

const Copyright: FC<CopyrightProps> = (props) => {
  const { startYear } = props;
  const endYear = new Date().getFullYear();
  const isDifferent = !!startYear && startYear !== endYear;
  return (
    <Fragment>
      {'Copyright © '}
      {isDifferent ? `${startYear}-${endYear}` : String(endYear)}
    </Fragment>
  );
};

export default Copyright;
