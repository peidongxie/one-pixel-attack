import boa from '@pipcook/boa';
import np, {
  type NumpyArray0D,
  type NumpyArray1D,
  type NumpyArray2D,
} from 'py:numpy';
import optimize from 'py:scipy.optimize';
import type ImageClassifier from '../image-classifier';

const { len, tuple } = boa.builtins();

class AdversarialAttacker {
  #imageClassifier: ImageClassifier;
  #perturbation: number;
  #pixels?: NumpyArray2D;
  #prediction?: NumpyArray1D;

  constructor(imageClassifier: ImageClassifier, perturbation?: number) {
    this.#imageClassifier = imageClassifier;
    if (perturbation === undefined) {
      const [row, column] = imageClassifier.getShape();
      this.#perturbation = Math.round(row * column * 0.01) || 1;
    } else {
      this.#perturbation = perturbation;
    }
  }

  attack(): NumpyArray2D {
    if (this.#pixels) return this.#pixels;
    const [row, column] = this.#imageClassifier.getShape();
    const bounds = new optimize.Bounds(
      tuple([0, 0, 0, 0, 0]).__mul__(this.#perturbation),
      tuple([row, column, 256, 256, 256]).__mul__(this.#perturbation),
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
    const pixels = this.#getPixelsByX(result.x);
    const prediction = this.#getPredictionWithX(pixels);
    this.#pixels = pixels;
    this.#prediction = prediction;
    return pixels;
  }

  getPerturbation(): number {
    return this.#perturbation;
  }

  getPixels(): NumpyArray2D | null {
    return this.#pixels || null;
  }

  getPrediction(): NumpyArray1D | null {
    return this.#prediction || null;
  }

  #differentialEvolutionCallback = (x: NumpyArray1D): true | void => {
    const label = this.#imageClassifier.getLabel();
    const prediction = this.#getPredictionWithX(x);
    if (label !== Number(np.argmax(prediction))) return true;
  };

  #differentialEvolutionFunc = (x: NumpyArray1D): NumpyArray0D => {
    const label = this.#imageClassifier.getLabel();
    const predictions = this.#getPredictionWithX(x);
    return predictions[label];
  };

  #getPixelsByX(x: NumpyArray1D): NumpyArray2D {
    const pixels = np.array<NumpyArray2D>(np.split(x, len(x) / 5));
    return np.floor(pixels);
  }

  #getPredictionWithX(x: NumpyArray1D | NumpyArray2D): NumpyArray1D {
    const image = this.#imageClassifier.getImage().copy();
    const model = this.#imageClassifier.getModel();
    const normalized = this.#imageClassifier.getNormalized();
    const pixels = x.ndim === 1 ? this.#getPixelsByX(x) : x;
    for (const pixel of pixels) {
      const [row, column, red, green, blue] = pixel;
      const colors = image.__getitem__(tuple([row, column]));
      colors[0] = normalized ? np.divide(red, 255) : red;
      colors[1] = normalized ? np.divide(green, 255) : green;
      colors[2] = normalized ? np.divide(blue, 255) : blue;
    }
    return model.predict<NumpyArray2D>(np.expand_dims(image, 0))[0];
  }
}

export { AdversarialAttacker as default };
