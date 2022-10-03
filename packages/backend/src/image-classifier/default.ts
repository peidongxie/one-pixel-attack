import boa from '@pipcook/boa';
import { existsSync } from 'fs';
import np, {
  type NumpyArray2D,
  type NumpyArray3D,
  type NumpyArray4D,
} from 'py://numpy';
import keras, { type Model } from 'py://tensorflow.keras';

const { tuple } = boa.builtins();

const loadData = (): {
  trainImages: NumpyArray4D;
  trainLabels: NumpyArray2D;
  testImages: NumpyArray4D;
  testLabels: NumpyArray2D;
} => {
  const [[trainImages, trainLabels], [testImages, testLabels]] =
    keras.datasets.cifar10.load_data();
  return {
    trainImages: np.divide(
      trainImages as NumpyArray4D,
      255,
      boa.kwargs({ dtype: 'float32' }),
    ),
    trainLabels: trainLabels as NumpyArray2D,
    testImages: np.divide(
      testImages as NumpyArray4D,
      255,
      boa.kwargs({ dtype: 'float32' }),
    ),
    testLabels: testLabels as NumpyArray2D,
  };
};

const loadModel = (): Model => {
  return keras.models.load_model('./public/model.h5');
};

const trainModel = (): Model => {
  const model = new keras.models.Sequential();
  model.add(
    new keras.layers.Conv2D(
      32,
      [3, 3],
      boa.kwargs({ activation: 'relu', input_shape: [32, 32, 3] }),
    ),
  );
  model.add(new keras.layers.MaxPooling2D(boa.kwargs({ pool_size: [2, 2] })));
  model.add(
    new keras.layers.Conv2D(64, [3, 3], boa.kwargs({ activation: 'relu' })),
  );
  model.add(new keras.layers.MaxPooling2D(boa.kwargs({ pool_size: [2, 2] })));
  model.add(
    new keras.layers.Conv2D(64, [3, 3], boa.kwargs({ activation: 'relu' })),
  );
  model.add(new keras.layers.Flatten());
  model.add(new keras.layers.Dense(64, boa.kwargs({ activation: 'relu' })));
  model.add(new keras.layers.Dense(10));
  model.compile(
    boa.kwargs({
      optimizer: 'adam',
      loss: new keras.losses.SparseCategoricalCrossentropy(
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
      validation_data: tuple([testImages, testLabels]),
    }),
  );
  const [testLoss, testAcc] = model.evaluate(
    boa.kwargs({ x: testImages, y: testLabels, verbose: 2 }),
  );
  globalThis.console.info(`loss: ${testLoss}, accuracy: ${testAcc}`);
  return model;
};

const { trainImages, trainLabels, testImages, testLabels } = loadData();
const model = existsSync('./public/model.h5') ? loadModel() : trainModel();
model.summary();

const getDefaultImage = (key: number): NumpyArray3D => {
  const index = Math.floor(key * 10000) % 10000;
  return testImages[index];
};

const getDefaultLabel = (key: number): number => {
  const index = Math.floor(key * 10000) % 10000;
  return testLabels[index][0].item();
};

const getDefaultModel = (): Model => {
  return new keras.models.Sequential(
    boa.kwargs({
      layers: [model, new keras.layers.Softmax()],
    }),
  );
};

export { getDefaultImage, getDefaultLabel, getDefaultModel };
