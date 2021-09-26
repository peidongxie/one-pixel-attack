import tf from '@tensorflow/tfjs-node';
import type { Tensor4D } from '@tensorflow/tfjs-node';
import { existsSync, readFile, createWriteStream } from 'fs-extra';
import type { IncomingMessage } from 'http';
import { get } from 'https';

export const downloadDefaultImages = async (): Promise<void> => {
  const stream = createWriteStream('./cache/images');
  const response = await new Promise<IncomingMessage>((resolve) =>
    get(
      'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_images.png',
      resolve,
    ),
  );
  response.pipe(stream);
  await new Promise<IncomingMessage>((resolve) => stream.on('close', resolve));
};

export const getDefaultImages = async (): Promise<[Tensor4D, Tensor4D]> => {
  const isCached = existsSync('./cache/images');
  if (!isCached) await downloadDefaultImages();
  const file = await readFile('./cache/images');
  const images = tf.node
    .decodePng(file)
    .reshape<Tensor4D>([60000, 32, 32, 3])
    .div<Tensor4D>(255);
  const train = images.slice(0, 50000);
  const test = images.slice(50000, 10000);
  return [train, test];
};
