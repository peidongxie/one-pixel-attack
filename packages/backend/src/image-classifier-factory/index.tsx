import np from 'py:numpy';
import ImageClassifier from '../image-classifier';
import { type MultipartFile } from '../wrap-http';

class ImageClassifierFactory {
  static createImageClassifier(
    model: 'default' | MultipartFile,
    image: 'default' | MultipartFile,
    label: string,
  ): ImageClassifier {
    while (image === 'default') {
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
    model: 'default' | MultipartFile,
    image: 'default' | MultipartFile,
    label: string,
  ): ImageClassifier {
    return new ImageClassifier(
      model === 'default' ? undefined : model,
      image === 'default' ? undefined : image,
      isNaN(Number(label)) ? undefined : Number(label),
    );
  }
}

export { ImageClassifierFactory as default };
