import boa from '@pipcook/boa';
import np from 'py:numpy';
import type { NumpyArray0D, NumpyArray1D, NumpyArray2D } from 'py:numpy';
import optimize from 'py:scipy.optimize';
import ImageClassifier from '../image-classifier';

const { len, tuple } = boa.builtins();

class AdversarialAttacker {
  imageClassifier: ImageClassifier;

  pixels?: NumpyArray2D;

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

  attack(): NumpyArray2D {
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
    const pixels = this.#getPixels(result.x);
    this.pixels = pixels;
    return pixels;
  }

  getPrediction(): NumpyArray1D | null {
    return this.pixels ? this.#getPrediction(this.pixels) : null;
  }

  #differentialEvolutionCallback = (x: NumpyArray1D): true | void => {
    const { label } = this.imageClassifier;
    const prediction = this.#getPrediction(x);
    if (label !== Number(np.argmax(prediction))) return true;
  };

  #differentialEvolutionFunc = (x: NumpyArray1D): NumpyArray0D => {
    const { label } = this.imageClassifier;
    const predictions = this.#getPrediction(x);
    return predictions[label];
  };

  #getPixels(x: NumpyArray1D): NumpyArray2D {
    const pixels = np.array<NumpyArray2D>(np.split(x, len(x) / 5));
    return np.floor(pixels);
  }

  #getPrediction(x: NumpyArray1D | NumpyArray2D): NumpyArray1D {
    const { image: originalImage, model, normalized } = this.imageClassifier;
    const image = originalImage.copy();
    const pixels = x.ndim === 1 ? this.#getPixels(x) : x;
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

export default AdversarialAttacker;
