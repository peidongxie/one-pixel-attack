declare module 'py:tensorflow' {
  import type { NumpyArray2D, NumpyArray4D } from 'py:numpy';
  class Loss {
    constructor(kwargs?: BoaKwargs);
  }
  class SparseCategoricalCrossentropy extends Loss {
    constructor(kwargs?: BoaKwargs);
  }
  class Layer {
    constructor(kwargs?: BoaKwargs);
  }
  class Conv2D extends Layer {
    constructor(
      filters: number,
      kernel_size: number | [number, number],
      kwargs?: BoaKwargs,
    );
  }
  class Dense extends Layer {
    constructor(units: number, kwargs?: BoaKwargs);
  }
  class Flatten extends Layer {
    constructor(kwargs?: BoaKwargs);
  }
  class MaxPooling2D extends Layer {
    constructor(kwargs?: BoaKwargs);
  }
  class Model extends Layer {
    constructor(kwargs?: BoaKwargs);
    compile: (kwargs?: BoaKwargs) => void;
    evaluate: (kwargs?: BoaKwargs) => [number, number];
    fit: (kwargs?: BoaKwargs) => void;
    summary: (kwargs?: BoaKwargs) => void;
  }
  class Sequential extends Model {
    constructor(kwargs?: BoaKwargs);
    add: (layer: Layer) => void;
  }
  export type {
    Conv2D,
    Dense,
    Flatten,
    Layer,
    Loss,
    MaxPooling2D,
    Model,
    Sequential,
    SparseCategoricalCrossentropy,
  };
  const tf: {
    keras: {
      datasets: {
        cifar10: {
          load_data: () => [
            [NumpyArray4D, NumpyArray2D],
            [NumpyArray4D, NumpyArray2D],
          ];
        };
      };
      layers: {
        Conv2D: typeof Conv2D;
        Dense: typeof Dense;
        Flatten: typeof Flatten;
        Layer: typeof Layer;
        MaxPooling2D: typeof MaxPooling2D;
      };
      losses: {
        SparseCategoricalCrossentropy: typeof SparseCategoricalCrossentropy;
      };
      models: {
        Model: typeof Model;
        Sequential: typeof Sequential;
        load_model: (filepath: string, kwargs?: BoaKwargs) => Model;
      };
    };
  };
  export default tf;
}
