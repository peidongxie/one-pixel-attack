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

interface Input {
  image: 'default' | MultipartFile;
  key: number;
}

const getImage = (input: Input): NumpyArray3D => {
  const { image, key } = input;
  if (image === 'default') return getDefaultImage(key);
  if (image.name === 'normalized.npy') return np.load(image.path);
  if (image.name === 'raw.npy') return np.divide(np.load(image.path), 255);
  const img = load_img(image.path);
  const array = img_to_array(img, boa.kwargs({ dtype: 'float64' }));
  return np.divide(array, 255);
};

export default getImage;
