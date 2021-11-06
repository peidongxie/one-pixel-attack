import boa from '@pipcook/boa';
import np from 'py:numpy';
import type { NumpyArray1D, NumpyArray2D, NumpyArray3D } from 'py:numpy';
import keras from 'py:tensorflow.keras';
import type { Model } from 'py:tensorflow.keras';
import { getDefaultImage, getDefaultLabel, getDefaultModel } from './default';
import type { MultipartFile } from '../server';

class ImageClassifier {
  image: NumpyArray3D;

  label: number;

  model: Model;

  normalized: boolean;

  shape: [number, number];

  constructor(model?: MultipartFile, image?: MultipartFile, label?: number) {
    const key = Math.random();
    if (model === undefined) {
      this.model = getDefaultModel();
      this.image = getDefaultImage(key);
      this.label = getDefaultLabel(key);
    } else if (image === undefined) {
      this.model = this.#getModel(model);
      this.image = getDefaultImage(key);
      this.label = getDefaultLabel(key);
      this.normalized = true;
    } else if (label === undefined) {
      this.model = this.#getModel(model);
      this.image = this.#getImage(image);
      this.label = Number(np.argmax(this.getPrediction()));
    } else {
      this.model = this.#getModel(model);
      this.image = this.#getImage(image);
      this.label = label;
    }
    this.normalized = model?.name !== 'raw.h5';
    this.shape = [this.image.shape[0], this.image.shape[1]];
  }

  getPrediction(): NumpyArray1D {
    return this.model.predict<NumpyArray2D>(np.expand_dims(this.image, 0))[0];
  }

  #getImage(image: MultipartFile): NumpyArray3D {
    if (image.name === 'normalized.npy') {
      const array = np.load<NumpyArray3D>(image.path).astype('float64');
      if (this.normalized) return array;
      return np.around(np.multiply(array, 255));
    }
    if (image.name === 'raw.npy') {
      const array = np.load<NumpyArray3D>(image.path).astype('float64');
      if (this.normalized) return np.divide(array, 255);
      return array;
    }
    const array = keras.preprocessing.image.img_to_array(
      keras.preprocessing.image.load_img(image.path),
      boa.kwargs({ dtype: 'float64' }),
    );
    if (this.normalized) np.divide(array, 255);
    return array;
  }

  #getModel(model: MultipartFile): Model {
    return new keras.models.Sequential(
      boa.kwargs({
        layers: [
          keras.models.load_model(model.path),
          new keras.layers.Softmax(),
        ],
      }),
    );
  }
}

export default ImageClassifier;
