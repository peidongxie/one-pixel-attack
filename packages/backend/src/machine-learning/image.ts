import tf from '@tensorflow/tfjs-node';
import type { Tensor4D } from '@tensorflow/tfjs-node';
import fs from 'fs-extra';
import type { IncomingMessage } from 'http';
import { get } from 'https';

const downloadDefaultImages = async (): Promise<void> => {
  const stream = fs.createWriteStream('./cache/images');
  const response = await new Promise<IncomingMessage>((resolve) =>
    get(
      'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_images.png',
      resolve,
    ),
  );
  response.pipe(stream);
  await new Promise<IncomingMessage>((resolve) => stream.on('close', resolve));
};

const createDefaultImages = async (): Promise<[Tensor4D, Tensor4D]> => {
  const isCached = fs.existsSync('./cache/images');
  if (!isCached) await downloadDefaultImages();
  const file = await fs.readFile('./cache/images');
  const images = tf.node
    .decodePng(file)
    .reshape<Tensor4D>([60000, 32, 32, 3])
    .div<Tensor4D>(255);
  const train = images.slice(0, 50000);
  const test = images.slice(50000, 10000);
  return [train, test];
};

const defaultImages = createDefaultImages();

export const getDefaultImages = (): Promise<[Tensor4D, Tensor4D]> => {
  return defaultImages;
};

export const getDefaultImage = async (
  key: number,
): Promise<{ tensor: Tensor4D; value: number[][][] }> => {
  const [images] = await getDefaultImages();
  const index = Math.floor(key * 50000) % 50000;
  const tensor = images.slice(index, 1);
  const value = tensor.mul<Tensor4D>(255).round().arraySync()[0];
  return { tensor, value };
};
