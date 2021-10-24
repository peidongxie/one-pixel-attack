import boa from '@pipcook/boa';
import np from 'py:numpy';
import type { NumpyArray3D } from 'py:numpy';
import tf from 'py:tensorflow';
import { getDefaultImage } from './default';
import type { MultipartFile } from '../server';

const {
  keras: {
    preprocessing: {
      image: { img_to_array, load_img },
    },
  },
} = tf;

const getImage = (option: number | MultipartFile): NumpyArray3D => {
  if (typeof option === 'number') return getDefaultImage(option);
  if (option.name === 'normalized.npy') return np.load(option.path);
  if (option.name === 'raw.npy') return np.divide(np.load(option.path), 255);
  const img = load_img(option.path);
  const array = img_to_array(img, boa.kwargs({ dtype: 'float64' }));
  return np.divide(array, 255);
};

export default getImage;
