declare module 'py:numpy' {
  interface NumpyArray {
    __getitem__: <T extends NumpyArray>(
      key:
        | number
        | NumpyArray0D
        | Slice
        | (number | NumpyArray0D | Slice)[]
        | List<number, number | NumpyArray0D | Slice>
        | Tuple<number, number | NumpyArray0D | Slice>,
    ) => T;
    astype: (dtype: string) => NumpyArray;
    copy: (kwargs?: BoaKwargs) => NumpyArray;
    ndim: number;
    shape: Tuple<number, number>;
    [Symbol.iterator]: () => IterableIterator<NumpyArray>;
    [key: number]: NumpyArray;
  }
  interface NumpyArray0D extends NumpyArray {
    astype: (dtype: string) => NumpyArray0D;
    copy: (kwargs?: BoaKwargs) => NumpyArray0D;
    item: () => number;
    ndim: 0;
    shape: Tuple<never, number>;
    [Symbol.iterator]: () => IterableIterator<never>;
    [key: number]: never;
  }
  interface NumpyArray1D extends NumpyArray {
    astype: (dtype: string) => NumpyArray1D;
    copy: (kwargs?: BoaKwargs) => NumpyArray1D;
    ndim: 1;
    shape: Tuple<0, number>;
    [Symbol.iterator]: () => IterableIterator<NumpyArray0D>;
    [key: number]: NumpyArray0D;
  }
  interface NumpyArray2D extends NumpyArray {
    astype: (dtype: string) => NumpyArray2D;
    copy: (kwargs?: BoaKwargs) => NumpyArray2D;
    ndim: 2;
    shape: Tuple<0 | 1, number>;
    [Symbol.iterator]: () => IterableIterator<NumpyArray1D>;
    [key: number]: NumpyArray1D;
  }
  interface NumpyArray3D extends NumpyArray {
    astype: (dtype: string) => NumpyArray3D;
    copy: (kwargs?: BoaKwargs) => NumpyArray3D;
    ndim: 3;
    shape: Tuple<0 | 1 | 2, number>;
    [Symbol.iterator]: () => IterableIterator<NumpyArray2D>;
    [key: number]: NumpyArray2D;
  }
  interface NumpyArray4D extends NumpyArray {
    astype: (dtype: string) => NumpyArray4D;
    copy: (kwargs?: BoaKwargs) => NumpyArray4D;
    ndim: 4;
    shape: Tuple<0 | 1 | 2 | 3, number>;
    [Symbol.iterator]: () => IterableIterator<NumpyArray3D>;
    [key: number]: NumpyArray3D;
  }
  const np: {
    amax: <T extends number | NumpyArray>(
      a: NumpyArray,
      kwargs?: BoaKwargs,
    ) => T;
    argmax: <T extends number | NumpyArray>(
      a: NumpyArray,
      kwargs?: BoaKwargs,
    ) => T;
    array: <T extends NumpyArray>(a: unknown, kwargs?: BoaKwargs) => T;
    around: <T extends NumpyArray>(a: T, kwargs?: BoaKwargs) => T;
    divide: <T extends NumpyArray>(x1: T, x2: number, kwargs?: BoaKwargs) => T;
    expand_dims: <T extends NumpyArray>(
      a: NumpyArray,
      axis: number | number[] | List<number, number> | Tuple<number, number>,
    ) => T;
    floor: <T extends NumpyArray>(a: T, kwargs?: BoaKwargs) => T;
    load: <T extends NumpyArray>(file: string, kwargs?: BoaKwargs) => T;
    multiply: <T extends NumpyArray>(
      x1: T,
      x2: number,
      kwargs?: BoaKwargs,
    ) => T;
    split: <T extends NumpyArray>(
      ary: T,
      indices_or_sections: number | NumpyArray1D,
      kwargs?: BoaKwargs,
    ) => List<number, T>;
  };
  export default np;
  export type {
    NumpyArray,
    NumpyArray0D,
    NumpyArray1D,
    NumpyArray2D,
    NumpyArray3D,
    NumpyArray4D,
  };
}
