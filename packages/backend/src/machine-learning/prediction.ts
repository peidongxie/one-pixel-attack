import np from 'py:numpy';
import type {
  NumpyArray,
  NumpyArray1D,
  NumpyArray2D,
  NumpyArray3D,
  NumpyArray4D,
  OtherNumpyArray,
} from 'py:numpy';
import type { Model } from 'py:tensorflow';

const getPrediction = <T extends NumpyArray3D | NumpyArray4D>(
  model: Model,
  image: T,
): OtherNumpyArray<T, -2> => {
  if (image.ndim === 3) {
    const prediction = model.predict<NumpyArray2D>(np.expand_dims(image, 0))[0];
    return prediction as OtherNumpyArray<T, -2>;
  }
  const prediction = model.predict<NumpyArray2D>(image);
  return prediction as OtherNumpyArray<T, -2>;
};

export default getPrediction;
