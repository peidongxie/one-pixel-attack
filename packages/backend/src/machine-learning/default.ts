import boa from '@pipcook/boa';
import np from 'py:numpy';
import type { NumpyArray1D, NumpyArray3D } from 'py:numpy';
import tf from 'py:tensorflow';

const {
  keras: {
    datasets: {
      cifar10: { load_data },
    },
    layers: { Conv2D, Dense, Flatten, MaxPooling2D },
    losses: { SparseCategoricalCrossentropy },
    models: { Sequential },
  },
} = tf;

const data = load_data();
const trainImages = np.divide(data[0][0], 255);
const trainLabels = data[0][1];
const testImages = np.divide(data[1][0], 255);
const testLabels = data[1][1];
const model = Sequential();
model.add(
  Conv2D(
    32,
    [3, 3],
    boa.kwargs({ activation: 'relu', input_shape: [32, 32, 3] }),
  ),
);
model.add(MaxPooling2D(boa.kwargs({ pool_size: [2, 2] })));
model.add(Conv2D(64, [3, 3], boa.kwargs({ activation: 'relu' })));
model.add(MaxPooling2D(boa.kwargs({ pool_size: [2, 2] })));
model.add(Conv2D(64, [3, 3], boa.kwargs({ activation: 'relu' })));
model.add(Flatten());
model.add(Dense(64, boa.kwargs({ activation: 'relu' })));
model.add(Dense(10));
model.compile(
  boa.kwargs({
    optimizer: 'adam',
    loss: SparseCategoricalCrossentropy(boa.kwargs({ from_logits: true })),
    metrics: ['accuracy'],
  }),
);
model.fit(
  boa.kwargs({
    x: trainImages,
    y: trainLabels,
    epochs: 1,
    validation_data: boa.builtins().tuple([testImages, testLabels]),
  }),
);
const [testLoss, testAcc] = model.evaluate(
  boa.kwargs({ x: testImages, y: testLabels, verbose: 2 }),
);
console.info(testLoss, testAcc);

export const getDefaultImage = (key: number): NumpyArray3D => {
  const index = Math.floor(key * 10000) % 10000;
  return testImages[index];
};

export const getDefaultModel = (): typeof model => model;

export const getDefaultLabel = (key: number): NumpyArray1D => {
  const index = Math.floor(key * 10000) % 10000;
  return testLabels[index];
};
