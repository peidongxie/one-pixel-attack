import np from 'py:numpy';
import type { NumpyArray1D } from 'py:numpy';
import { getDefaultLabel } from './default';

const getLabel = (option: number | string | NumpyArray1D): number => {
  if (typeof option === 'number') return getDefaultLabel(option);
  if (typeof option === 'string') return Number(option);
  return np.argmax(option);
};

export default getLabel;
