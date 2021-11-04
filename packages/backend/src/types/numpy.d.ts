declare module 'py:numpy' {
  type NumberArray = number | NumberArray[];
  interface NumpyArray {
    __getitem__: <T extends NumpyArray>(
      key:
        | number
        | NumpyArray0D
        | Slice
        | (number | NumpyArray0D | Slice)[]
        | Tuple<number, number | NumpyArray0D | Slice>,
    ) => T;
    astype: (dtype: string) => NumpyArray;
    copy: (kwargs?: BoaKwargs) => NumpyArray;
    ndim: number;
    shape: Tuple<number, number>;
    tolist: () => NumberArray;
    [Symbol.iterator]: () => IterableIterator<NumpyArray>;
    [key: number]: NumpyArray;
  }
  interface NumpyArray0D extends NumpyArray {
    astype: (dtype: string) => NumpyArray0D;
    ndim: 0;
    shape: Tuple<never, number>;
    tolist: () => number;
    [Symbol.iterator]: () => IterableIterator<never>;
    [key: number]: never;
  }
  interface NumpyArray1D extends NumpyArray {
    astype: (dtype: string) => NumpyArray1D;
    ndim: 1;
    shape: Tuple<0, number>;
    tolist: () => number[];
    [Symbol.iterator]: () => IterableIterator<NumpyArray0D>;
    [key: number]: NumpyArray0D;
  }
  interface NumpyArray2D extends NumpyArray {
    astype: (dtype: string) => NumpyArray2D;
    ndim: 2;
    shape: Tuple<0 | 1, number>;
    tolist: () => number[][];
    [Symbol.iterator]: () => IterableIterator<NumpyArray1D>;
    [key: number]: NumpyArray1D;
  }
  interface NumpyArray3D extends NumpyArray {
    astype: (dtype: string) => NumpyArray3D;
    ndim: 3;
    shape: Tuple<0 | 1 | 2, number>;
    tolist: () => number[][][];
    [Symbol.iterator]: () => IterableIterator<NumpyArray2D>;
    [key: number]: NumpyArray2D;
  }
  interface NumpyArray4D extends NumpyArray {
    astype: (dtype: string) => NumpyArray4D;
    ndim: 4;
    shape: Tuple<0 | 1 | 2 | 3, number>;
    tolist: () => number[][][][];
    [Symbol.iterator]: () => IterableIterator<NumpyArray3D>;
    [key: number]: NumpyArray3D;
  }
  export type {
    NumpyArray,
    NumpyArray0D,
    NumpyArray1D,
    NumpyArray2D,
    NumpyArray3D,
    NumpyArray4D,
  };
  const np: {
    argmax: <T extends number | NumpyArray>(
      a: NumpyArray,
      kwargs?: BoaKwargs,
    ) => T;
    array: <T extends NumpyArray>(a: unknown, kwargs?: BoaKwargs) => T;
    around: <T extends NumpyArray>(a: T, kwargs?: BoaKwargs) => T;
    divide: <T extends NumpyArray>(x1: T, x2: number) => T;
    expand_dims: <T extends NumpyArray>(
      a: NumpyArray,
      axis: number | number[] | Tuple<number, number>,
    ) => T;
    floor: <T extends NumpyArray>(a: T, kwargs?: BoaKwargs) => T;
    load: <T extends NumpyArray>(file: string) => T;
    multiply: <T extends NumpyArray>(x1: T, x2: number) => T;
    split: <T extends NumpyArray>(
      ary: T,
      indices_or_sections: number | NumpyArray1D,
    ) => List<number, T>;
    tile: <T extends NumpyArray>(
      A: NumpyArray,
      reps: number | number[] | Tuple<number, number>,
    ) => T;
  };
  export default np;
}
