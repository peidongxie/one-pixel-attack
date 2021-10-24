import boa from '@pipcook/boa';
import fs from 'fs-extra';
import np from 'py:numpy';
import type { NumpyArray2D, NumpyArray3D, NumpyArray4D } from 'py:numpy';
import tf from 'py:tensorflow';
import type { Model } from 'py:tensorflow';

const {
  keras: {
    datasets: {
      cifar10: { load_data },
    },
    layers: { Conv2D, Dense, Flatten, MaxPooling2D, Softmax },
    losses: { SparseCategoricalCrossentropy },
    models: { Sequential, load_model },
  },
} = tf;

const loadData = (): {
  trainImages: NumpyArray4D;
  trainLabels: NumpyArray2D;
  testImages: NumpyArray4D;
  testLabels: NumpyArray2D;
} => {
  const [[trainImages, trainLabels], [testImages, testLabels]] = load_data();
  return {
    trainImages: np.divide(trainImages as NumpyArray4D, 255),
    trainLabels: trainLabels as NumpyArray2D,
    testImages: np.divide(testImages as NumpyArray4D, 255),
    testLabels: testLabels as NumpyArray2D,
  };
};

const loadModel = (): Model => {
  return load_model('./public/model.h5');
};

const trainModel = (): Model => {
  const model = new Sequential();
  model.add(
    new Conv2D(
      32,
      [3, 3],
      boa.kwargs({ activation: 'relu', input_shape: [32, 32, 3] }),
    ),
  );
  model.add(new MaxPooling2D(boa.kwargs({ pool_size: [2, 2] })));
  model.add(new Conv2D(64, [3, 3], boa.kwargs({ activation: 'relu' })));
  model.add(new MaxPooling2D(boa.kwargs({ pool_size: [2, 2] })));
  model.add(new Conv2D(64, [3, 3], boa.kwargs({ activation: 'relu' })));
  model.add(new Flatten());
  model.add(new Dense(64, boa.kwargs({ activation: 'relu' })));
  model.add(new Dense(10));
  // todo
  model.compile(
    boa.kwargs({
      optimizer: 'adam',
      loss: new SparseCategoricalCrossentropy(
        boa.kwargs({ from_logits: true }),
      ),
      metrics: ['accuracy'],
    }),
  );
  model.fit(
    boa.kwargs({
      x: trainImages,
      y: trainLabels,
      epochs: 10,
      validation_data: boa.builtins().tuple([testImages, testLabels]),
    }),
  );
  const [testLoss, testAcc] = model.evaluate(
    boa.kwargs({ x: testImages, y: testLabels, verbose: 2 }),
  );
  console.info(`loss: ${testLoss}, accuracy: ${testAcc}`);
  return model;
};

const { trainImages, trainLabels, testImages, testLabels } = loadData();
const model = fs.existsSync('./public/model.h5') ? loadModel() : trainModel();
model.summary();

export const getDefaultImage = (key: number): NumpyArray3D => {
  const index = Math.floor(key * 10000) % 10000;
  return testImages[index];
};

export const getDefaultLabel = (key: number): number => {
  const index = Math.floor(key * 10000) % 10000;
  return testLabels[index][0];
};

export const getDefaultModel = (): Model => model;
