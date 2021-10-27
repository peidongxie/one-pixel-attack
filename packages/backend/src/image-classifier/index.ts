import boa from '@pipcook/boa';
import np from 'py:numpy';
import type {
  NumpyArray1D,
  NumpyArray2D,
  NumpyArray3D,
  NumpyArray4D,
} from 'py:numpy';
import tf from 'py:tensorflow';
import type { Model } from 'py:tensorflow';
import { getDefaultImage, getDefaultLabel, getDefaultModel } from './default';
import type { MultipartFile } from '../server';

const {
  keras: {
    layers: { Softmax },
    models: { Sequential, load_model },
    preprocessing: {
      image: { img_to_array, load_img },
    },
  },
} = tf;

class ImageClassifier {
  image: NumpyArray3D;

  label: number;

  model: Model;

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
    } else if (label === undefined) {
      this.model = this.#getModel(model);
      this.image = this.#getImage(image);
      this.label = np.argmax(this.getPrediction());
    } else {
      this.model = this.#getModel(model);
      this.image = this.#getImage(image);
      this.label = label;
    }
  }

  getPrediction(): NumpyArray1D {
    return this.model.predict<NumpyArray2D>(np.expand_dims(this.image, 0))[0];
  }

  getPredictions(images: NumpyArray4D): NumpyArray2D {
    return this.model.predict<NumpyArray2D>(images);
  }

  getShape(): [number, number] {
    const [height, width] = this.image.shape;
    return [width, height];
  }

  #getImage(image: MultipartFile): NumpyArray3D {
    if (image.name === 'normalized.npy') return np.load(image.path);
    if (image.name === 'raw.npy') return np.divide(np.load(image.path), 255);
    const img = load_img(image.path);
    const array = img_to_array(img, boa.kwargs({ dtype: 'float64' }));
    return np.divide(array, 255);
  }

  #getModel(model: MultipartFile): Model {
    return new Sequential(
      boa.kwargs({
        layers: [load_model(model.path), new Softmax()],
      }),
    );
  }
}

export default ImageClassifier;
