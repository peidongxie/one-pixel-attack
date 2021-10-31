declare module 'py:scipy.optimize' {
  import type { NumpyArray } from 'py:numpy';
  class Bounds {
    constructor(
      lb: number[] | Tuple<number, number>,
      ub: number[] | Tuple<number, number>,
      kwargs?: BoaKwargs,
    );
  }
  interface OptimizeResult<T extends NumpyArray> {
    x: T;
    success: boolean;
  }
  export type { Bounds, OptimizeResult };
  const optimize: {
    Bounds: typeof Bounds;
    differential_evolution: <T extends NumpyArray>(
      func: (x: T, kwargs?: BoaKwargs) => void,
      bounds: Bounds,
      kwargs?: BoaKwargs,
    ) => OptimizeResult<T>;
  };
  export default optimize;
}
