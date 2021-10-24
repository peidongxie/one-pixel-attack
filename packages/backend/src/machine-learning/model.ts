import boa from '@pipcook/boa';
import tf from 'py:tensorflow';
import type { Model } from 'py:tensorflow';
import { getDefaultModel } from './default';
import type { MultipartFile } from '../server';

const {
  keras: {
    layers: { Softmax },
    models: { Sequential, load_model },
  },
} = tf;

const getModel = (option?: MultipartFile): Model => {
  return new Sequential(
    boa.kwargs({
      layers: [
        option ? load_model(option.path) : getDefaultModel(),
        new Softmax(),
      ],
    }),
  );
};

export default getModel;
