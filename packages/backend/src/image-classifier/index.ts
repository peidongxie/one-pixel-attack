import boa from '@pipcook/boa';
import np, {
  type NumpyArray1D,
  type NumpyArray2D,
  type NumpyArray3D,
} from 'py:numpy';
import keras, { type Model } from 'py:tensorflow.keras';
import { getDefaultImage, getDefaultLabel, getDefaultModel } from './default';
import { type MultipartFile } from '../wrap-http';

class ImageClassifier {
  #image: NumpyArray3D;
  #label: number;
  #model: Model;
  #normalized: boolean;
  #prediction: NumpyArray1D;
  #shape: [number, number];

  constructor(model?: MultipartFile, image?: MultipartFile, label?: number) {
    const key = Math.random();
    if (model === undefined) {
      this.#model = getDefaultModel();
      this.#normalized = true;
      this.#image = getDefaultImage(key);
      this.#shape = [this.#image.shape[0], this.#image.shape[1]];
      this.#prediction = this.#model.predict<NumpyArray2D>(
        np.expand_dims(this.#image, 0),
      )[0];
      this.#label = getDefaultLabel(key);
    } else if (image === undefined) {
      this.#model = this.#getModel(model);
      this.#normalized = model.name !== 'raw.h5';
      this.#image = getDefaultImage(key);
      this.#shape = [this.#image.shape[0], this.#image.shape[1]];
      this.#prediction = this.#model.predict<NumpyArray2D>(
        np.expand_dims(this.#image, 0),
      )[0];
      this.#label = getDefaultLabel(key);
    } else if (label === undefined) {
      this.#model = this.#getModel(model);
      this.#normalized = model.name !== 'raw.h5';
      this.#image = this.#getImage(image);
      this.#shape = [this.#image.shape[0], this.#image.shape[1]];
      this.#prediction = this.#model.predict<NumpyArray2D>(
        np.expand_dims(this.#image, 0),
      )[0];
      this.#label = Number(np.argmax(this.getPrediction()));
    } else {
      this.#model = this.#getModel(model);
      this.#normalized = model.name !== 'raw.h5';
      this.#image = this.#getImage(image);
      this.#shape = [this.#image.shape[0], this.#image.shape[1]];
      this.#prediction = this.#model.predict<NumpyArray2D>(
        np.expand_dims(this.#image, 0),
      )[0];
      this.#label = label;
    }
  }

  getImage(): NumpyArray3D {
    return this.#image;
  }

  getLabel(): number {
    return this.#label;
  }

  getModel(): Model {
    return this.#model;
  }

  getNormalized(): boolean {
    return this.#normalized;
  }

  getPrediction(): NumpyArray1D {
    return this.#prediction;
  }

  getShape(): [number, number] {
    return this.#shape;
  }

  #getImage(image: MultipartFile): NumpyArray3D {
    if (image.name === 'normalized.npy') {
      const array = np.load<NumpyArray3D>(image.path).astype('float32');
      if (this.#normalized) return array;
      return np.around(np.multiply(array, 255));
    }
    if (image.name === 'raw.npy') {
      const array = np.load<NumpyArray3D>(image.path).astype('float32');
      if (this.#normalized) return np.divide(array, 255);
      return array;
    }
    const array = keras.preprocessing.image.img_to_array(
      keras.preprocessing.image.load_img(image.path),
      boa.kwargs({ dtype: 'float32' }),
    );
    if (this.#normalized) return np.divide(array, 255);
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

export { ImageClassifier as default };
