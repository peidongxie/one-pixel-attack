declare module 'py:tensorflow' {
  import type { Image } from 'py:PIL';
  import type {
    NumpyArray,
    NumpyArray2D,
    NumpyArray3D,
    NumpyArray4D,
  } from 'py:numpy';
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
      kernel_size: number | [number, number] | Tuple<0 | 1, number>,
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
  class Softmax extends Layer {
    constructor(kwargs?: BoaKwargs);
  }
  class Model extends Layer {
    constructor(kwargs?: BoaKwargs);
    compile: (kwargs?: BoaKwargs) => void;
    evaluate: (kwargs?: BoaKwargs) => [number, number];
    fit: (kwargs?: BoaKwargs) => void;
    predict: <T extends NumpyArray>(NumpyArray) => T;
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
    Softmax,
    SparseCategoricalCrossentropy,
  };
  const tf: {
    keras: {
      datasets: {
        cifar10: {
          load_data: () => Tuple<
            0 | 1,
            Tuple<0 | 1, NumpyArray2D | NumpyArray4D>
          >;
        };
      };
      preprocessing: {
        image: {
          img_to_array: (img: Image, kwargs?: BoaKwargs) => NumpyArray3D;
          load_img: (path: string, kwargs?: BoaKwargs) => Image;
        };
      };
      layers: {
        Conv2D: typeof Conv2D;
        Dense: typeof Dense;
        Flatten: typeof Flatten;
        Layer: typeof Layer;
        MaxPooling2D: typeof MaxPooling2D;
        Softmax: typeof Softmax;
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
