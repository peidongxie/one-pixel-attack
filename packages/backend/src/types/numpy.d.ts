declare module 'py:numpy' {
  export interface NumpyArray {
    shape: number[];
    [key: number]: NumpyArray | number;
  }
  export interface NumpyArray1D extends NumpyArray {
    shape: [number];
    [key: number]: number;
  }
  export interface NumpyArray2D extends NumpyArray {
    shape: [number, number];
    [key: number]: NumpyArray1D;
  }
  export interface NumpyArray3D extends NumpyArray {
    shape: [number, number, number];
    [key: number]: NumpyArray2D;
  }
  export interface NumpyArray4D extends NumpyArray {
    shape: [number, number, number, number];
    [key: number]: NumpyArray3D;
  }
  const np: {
    divide: <T extends NumpyArray>(x1: T, x2: number) => T;
  };
  export default np;
}
