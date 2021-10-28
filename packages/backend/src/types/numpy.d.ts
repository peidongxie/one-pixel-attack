declare module 'py:numpy' {
  interface NumpyArray {
    astype: (dtype: string) => NumpyArray;
    ndim: number;
    shape: Tuple<number, number>;
    tolist: () => number[] | number[][] | number[][][] | number[][][][];
    [key: number]: NumpyArray | number;
  }
  interface NumpyArray1D extends NumpyArray {
    astype: (dtype: string) => NumpyArray1D;
    ndim: 1;
    shape: Tuple<0, number>;
    tolist: () => number[];
    [key: number]: number;
  }
  interface NumpyArray2D extends NumpyArray {
    astype: (dtype: string) => NumpyArray2D;
    ndim: 2;
    shape: Tuple<0 | 1, number>;
    tolist: () => number[][];
    [key: number]: NumpyArray1D;
  }
  interface NumpyArray3D extends NumpyArray {
    astype: (dtype: string) => NumpyArray3D;
    ndim: 3;
    shape: Tuple<0 | 1 | 2, number>;
    tolist: () => number[][][];
    [key: number]: NumpyArray2D;
  }
  interface NumpyArray4D extends NumpyArray {
    astype: (dtype: string) => NumpyArray4D;
    ndim: 4;
    shape: Tuple<0 | 1 | 2 | 3, number>;
    tolist: () => number[][][][];
    [key: number]: NumpyArray3D;
  }
  type OtherNumpyArray<
    T extends
      | number
      | NumpyArray1D
      | NumpyArray2D
      | NumpyArray3D
      | NumpyArray4D,
    N extends number = 0,
  > = T extends number
    ? {
        [-2]: never;
        [-1]: never;
        0: number;
        1: NumpyArray1D;
        2: NumpyArray2D;
      }[N]
    : T extends NumpyArray1D
    ? {
        [-2]: never;
        [-1]: number;
        0: NumpyArray1D;
        1: NumpyArray2D;
        2: NumpyArray3D;
      }[N]
    : T extends NumpyArray2D
    ? {
        [-2]: number;
        [-1]: NumpyArray1D;
        0: NumpyArray2D;
        1: NumpyArray3D;
        2: NumpyArray4D;
      }[N]
    : T extends NumpyArray3D
    ? {
        [-2]: NumpyArray1D;
        [-1]: NumpyArray2D;
        0: NumpyArray3D;
        1: NumpyArray4D;
        2: never;
      }[N]
    : T extends NumpyArray4D
    ? {
        [-2]: NumpyArray2D;
        [-1]: NumpyArray3D;
        0: NumpyArray4D;
        1: never;
        2: never;
      }[N]
    : never;
  export type {
    NumpyArray,
    NumpyArray1D,
    NumpyArray2D,
    NumpyArray3D,
    NumpyArray4D,
    OtherNumpyArray,
  };
  const np: {
    argmax: <T extends number | NumpyArray>(
      a: NumpyArray,
      kwargs?: BoaKwargs,
    ) => T;
    around: <T extends NumpyArray>(a: T, kwargs?: BoaKwargs) => T;
    divide: <T extends NumpyArray>(x1: T, x2: number) => T;
    expand_dims: <T extends NumpyArray>(
      a: NumpyArray,
      axis: number | number[] | Tuple<number, number>,
    ) => T;
    load: <T extends NumpyArray>(file: string) => T;
    multiply: <T extends NumpyArray>(x1: T, x2: number) => T;
  };
  export default np;
}
