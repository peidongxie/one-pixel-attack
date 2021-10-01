import type {
  LayersModel,
  Tensor1D,
  Tensor2D,
  Tensor4D,
} from '@tensorflow/tfjs-node';

const predict = (
  model: LayersModel,
  image: Tensor4D,
): { tensor: Tensor2D; top: number; value: number[] } => {
  const tensor = model.predict(image) as Tensor2D;
  const top = tensor.argMax<Tensor1D>(-1).arraySync()[0];
  const value = tensor.arraySync()[0];
  return { tensor, top, value };
};

export default predict;
