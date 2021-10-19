declare module 'py:numpy' {
  export interface NumpyArray {
    shape: number[];
    tolist: () => number[] | number[][] | number[][][] | number[][][][];
    [key: number]: NumpyArray | number;
  }
  export interface NumpyArray1D extends NumpyArray {
    shape: [number];
    tolist: () => number[];
    [key: number]: number;
  }
  export interface NumpyArray2D extends NumpyArray {
    shape: [number, number];
    tolist: () => number[][];
    [key: number]: NumpyArray1D;
  }
  export interface NumpyArray3D extends NumpyArray {
    shape: [number, number, number];
    tolist: () => number[][][];
    [key: number]: NumpyArray2D;
  }
  export interface NumpyArray4D extends NumpyArray {
    shape: [number, number, number, number];
    tolist: () => number[][][][];
    [key: number]: NumpyArray3D;
  }
  const np: {
    around: <T extends NumpyArray>(a: T, kwargs?: BoaKwargs) => T;
    divide: <T extends NumpyArray>(x1: T, x2: number) => T;
    load: <T extends NumpyArray>(file: string) => T;
    multiply: <T extends NumpyArray>(x1: T, x2: number) => T;
  };
  export default np;
}
