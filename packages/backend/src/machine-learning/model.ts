import tf from '@tensorflow/tfjs-node';
import type { LayersModel } from '@tensorflow/tfjs-node';
import fs from 'fs-extra';
import { getDefaultImages } from './image';
import { getDefaultLabels } from './label';

const trainDefaultModel = async (): Promise<void> => {
  const [trainXs, testXs] = await getDefaultImages();
  const [trainYs, testYs] = await getDefaultLabels();
  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: [3, 3],
      activation: 'relu',
      inputShape: [32, 32, 3],
    }),
  );
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(
    tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      activation: 'relu',
    }),
  );
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(
    tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      activation: 'relu',
    }),
  );
  model.add(tf.layers.flatten());
  model.add(
    tf.layers.dense({
      units: 64,
      activation: 'relu',
    }),
  );
  model.add(
    tf.layers.dense({
      units: 10,
      activation: 'softmax',
    }),
  );
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  await model.fit(trainXs, trainYs, {
    epochs: 10,
    validationData: [testXs, testYs],
  });
  await model.save('file://./cache');
};

const createDefaultModel = async (): Promise<LayersModel> => {
  const isCached =
    fs.existsSync('./cache/model.json') && fs.existsSync('./cache/weights.bin');
  if (!isCached) await trainDefaultModel();
  return tf.loadLayersModel('file://./cache/model.json');
};

const defaultModel = createDefaultModel();

export const getDefaultModel = (): Promise<LayersModel> => {
  return defaultModel;
};
