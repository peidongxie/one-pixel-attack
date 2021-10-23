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

interface Input {
  model: 'default' | MultipartFile;
}

const getModel = (input: Input): Model => {
  return new Sequential(
    boa.kwargs({
      layers: [
        input.model === 'default'
          ? getDefaultModel()
          : load_model(input.model.path),
        new Softmax(),
      ],
    }),
  );
};

export default getModel;
