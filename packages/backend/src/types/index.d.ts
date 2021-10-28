type BoaKwargs = unknown;
type PilImage = unknown;
type Tuple<K extends number, T> = Record<K, T> & {
  __mul__: (n: number) => Tuple<K, T>;
  [Symbol.iterator]: () => IterableIterator<T>;
};
