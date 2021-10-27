import ImageClassifier from '../image-classifier';

class AdversarialAttacker {
  imageClassifier: ImageClassifier;
  perturbation: number;

  constructor(imageClassifier: ImageClassifier, perturbation?: number) {
    this.imageClassifier = imageClassifier;
    if (perturbation === undefined) {
      const [width, height] = imageClassifier.getShape();
      this.perturbation = Math.round(width * height * 0.01);
    } else {
      this.perturbation = perturbation;
    }
  }
}

export default AdversarialAttacker;
