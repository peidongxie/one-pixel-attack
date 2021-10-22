type BoaKwargs = unknown;
type PilImage = unknown;
type Tuple<K extends string | number | symbol, T> = Record<K, T> & {
  [Symbol.iterator]: () => IterableIterator<T>;
};
