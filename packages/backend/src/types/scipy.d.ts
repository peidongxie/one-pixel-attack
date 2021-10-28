declare module 'py:scipy' {
  import type { NumpyArray, NumpyArray1D } from 'py:numpy';
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
  const scipy: {
    optimize: {
      differential_evolution: <T extends NumpyArray>(
        func: (x: NumpyArray1D, kwargs?: BoaKwargs) => void,
        bounds: Bounds,
        kwargs?: BoaKwargs,
      ) => OptimizeResult<T>;
    };
  };
  export default scipy;
}
