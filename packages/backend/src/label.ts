import tf from '@tensorflow/tfjs-node';
import type { Tensor1D, Tensor2D } from '@tensorflow/tfjs-node';
import { existsSync, readFile, createWriteStream } from 'fs-extra';
import type { IncomingMessage } from 'http';
import { get } from 'https';

const downloadDefaultLabels = async (): Promise<void> => {
  const stream = createWriteStream('./cache/labels');
  const response = await new Promise<IncomingMessage>((resolve) =>
    get(
      'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_labels_uint8',
      resolve,
    ),
  );
  response.pipe(stream);
  await new Promise<IncomingMessage>((resolve) => stream.on('close', resolve));
};

const createDefaultLabels = async (): Promise<[Tensor2D, Tensor2D]> => {
  const isCached = existsSync('./cache/labels');
  if (!isCached) await downloadDefaultLabels();
  const file = await readFile('./cache/labels');
  const labels = tf.tensor2d(file, [60000, 10]);
  const train = labels.slice(0, 50000);
  const test = labels.slice(50000, 10000);
  return [train, test];
};

const defaultLabels = createDefaultLabels();

export const getDefaultLabels = (): Promise<[Tensor2D, Tensor2D]> => {
  return defaultLabels;
};

export const getDefaultLabel = async (key: number): Promise<number> => {
  const [labels] = await getDefaultLabels();
  const index = Math.floor(key * 50000) % 50000;
  const originalValue = labels.slice(index, 1);
  const value = originalValue.argMax<Tensor1D>(-1).arraySync()[0];
  return value;
};
