import boa from '@pipcook/boa';
import np from 'py:numpy';
import type {
  NumpyArray0D,
  NumpyArray1D,
  NumpyArray2D,
  NumpyArray3D,
  NumpyArray4D,
} from 'py:numpy';
import optimize from 'py:scipy.optimize';
import ImageClassifier from '../image-classifier';

const { len, tuple, zip } = boa.builtins();

class AdversarialAttacker {
  imageClassifier: ImageClassifier;

  perturbation: number;

  constructor(imageClassifier: ImageClassifier, perturbation?: number) {
    this.imageClassifier = imageClassifier;
    if (perturbation === undefined) {
      const [row, column] = imageClassifier.shape;
      this.perturbation = Math.round(row * column * 0.01) || 1;
    } else {
      this.perturbation = perturbation;
    }
  }

  attack(): NumpyArray1D {
    const [row, column] = this.imageClassifier.shape;
    const bounds = new optimize.Bounds(
      tuple([0, 0, 0, 0, 0]).__mul__(this.perturbation),
      tuple([row, column, 256, 256, 256]).__mul__(this.perturbation),
    );
    const result = optimize.differential_evolution(
      this.#differentialEvolutionFunc,
      bounds,
      boa.kwargs({
        maxiter: 9,
        popsize: 10,
        recombination: 1,
        atol: -1,
        callback: this.#differentialEvolutionCallback,
        polish: false,
      }),
    );
    return result.x;
  }

  getPrediction(x: NumpyArray1D): NumpyArray1D {
    const { image, model, normalized } = this.imageClassifier;
    const groups = np.expand_dims<NumpyArray2D>(x, 0);
    const images = np.tile<NumpyArray4D>(image, [len(groups), 1, 1, 1]);
    for (const e of zip(images, groups)) {
      const image: NumpyArray3D = e[0];
      const group: NumpyArray1D = e[1];
      const pixels = np.split(group, len(group) / 5);
      for (const pixel of pixels) {
        const row = np.floor(pixel[0]);
        const column = np.floor(pixel[1]);
        const red = np.floor(pixel[2]);
        const green = np.floor(pixel[3]);
        const blue = np.floor(pixel[4]);
        const colors = image.__getitem__(tuple([row, column]));
        colors[0] = normalized ? np.divide(red, 255) : red;
        colors[1] = normalized ? np.divide(green, 255) : green;
        colors[2] = normalized ? np.divide(blue, 255) : blue;
      }
    }
    return model.predict<NumpyArray2D>(images)[0];
  }

  #differentialEvolutionCallback = (x: NumpyArray1D): true | void => {
    const { label } = this.imageClassifier;
    const prediction = this.getPrediction(x);
    if (label !== Number(np.argmax(prediction))) return true;
  };

  #differentialEvolutionFunc = (x: NumpyArray1D): NumpyArray0D => {
    const { label } = this.imageClassifier;
    const predictions = this.getPrediction(x);
    return predictions[label];
  };
}

export default AdversarialAttacker;
