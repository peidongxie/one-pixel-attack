import type { NumpyArray3D } from 'py:numpy';

const getShape = (image: NumpyArray3D): [number, number] => {
  const [height, width] = image.shape;
  return [width, height];
};

export default getShape;
