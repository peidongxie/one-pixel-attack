import tf from '@tensorflow/tfjs-node';
import type { Tensor2D } from '@tensorflow/tfjs-node';
import { existsSync, readFile, createWriteStream } from 'fs-extra';
import type { IncomingMessage } from 'http';
import { get } from 'https';

export const downloadDefaultLabels = async (): Promise<void> => {
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

export const getDefaultLabels = async (): Promise<[Tensor2D, Tensor2D]> => {
  const isCached = existsSync('./cache/labels');
  if (!isCached) await downloadDefaultLabels();
  const file = await readFile('./cache/labels');
  const labels = tf.tensor2d(file, [60000, 10]);
  const train = labels.slice(0, 50000);
  const test = labels.slice(50000, 10000);
  return [train, test];
};
