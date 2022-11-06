import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import np from 'py://numpy';
import ImageClassifier from '../image-classifier';

class ImageClassifierFactory {
  static async createImageClassifier(
    model: string | File,
    image: string | File,
    label: string,
  ): Promise<ImageClassifier> {
    while (typeof image === 'string') {
      const imageClassifier = await this.#createImageClassifier(
        model,
        image,
        label,
      );
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

  static async #createImageClassifier(
    model: string | File,
    image: string | File,
    label: string,
  ): Promise<ImageClassifier> {
    return new ImageClassifier(
      typeof model === 'string' ? undefined : await this.#saveFile(model),
      typeof image === 'string' ? undefined : await this.#saveFile(image),
      isNaN(Number(label)) ? undefined : Number(label),
    );
  }

  static async #saveFile(file: File): Promise<string> {
    const path = join(tmpdir(), `${Date.now()}_${randomUUID()}_${file.name}`);
    const buffer = await file.arrayBuffer();
    writeFileSync(path, Buffer.from(buffer));
    return path;
  }
}

export { ImageClassifierFactory as default };
