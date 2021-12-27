import type boa from '@pipcook/boa';
declare global {
  type PyObject = ReturnType<typeof boa['eval']>;
  type BoaKwargs = PyObject;
  interface Slice extends PyObject {
    start: null | number;
    step: null | number;
    stop: number;
  }
  interface List<K extends number, T> extends PyObject {
    __mul__: (n: number) => Tuple<K, T>;
    [Symbol.iterator]: () => IterableIterator<T>;
    [key: K]: T;
  }
  interface Tuple<K extends number, T> extends PyObject {
    __mul__: (n: number) => Tuple<K, T>;
    [Symbol.iterator]: () => IterableIterator<T>;
    [key: K]: T;
  }
}
