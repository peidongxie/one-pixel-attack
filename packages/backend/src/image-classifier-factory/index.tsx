import np from 'py:numpy';
import ImageClassifier from '../image-classifier';

class ImageClassifierFactory {
  static createImageClassifier(
    model: string | URL,
    image: string | URL,
    label: string,
  ): ImageClassifier {
    while (typeof image === 'string') {
      const imageClassifier = this.#createImageClassifier(model, image, label);
      const prediction = imageClassifier.getPrediction();
      if (
        Number(np.argmax(prediction)) === imageClassifier.getLabel() &&
        Number(np.amax(prediction)) < 0.95
      ) {
        return imageClassifier;
      }
    }
    return this.#createImageClassifier(model, image, label);
  }

  static #createImageClassifier(
    model: string | URL,
    image: string | URL,
    label: string,
  ): ImageClassifier {
    return new ImageClassifier(
      typeof model === 'string' ? undefined : model,
      typeof image === 'string' ? undefined : image,
      isNaN(Number(label)) ? undefined : Number(label),
    );
  }
}

export { ImageClassifierFactory as default };
