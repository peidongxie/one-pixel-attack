declare module 'py://tensorflow.keras' {
  import { type Image } from 'py://PIL';
  import {
    type NumpyArray,
    type NumpyArray2D,
    type NumpyArray3D,
    type NumpyArray4D,
  } from 'py://numpy';
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
  const keras: {
    datasets: {
      cifar10: {
        load_data: () => Tuple<
          0 | 1,
          Tuple<0 | 1, NumpyArray2D | NumpyArray4D>
        >;
      };
    };
    layers: {
      Conv2D: typeof Conv2D;
      Dense: typeof Dense;
      Flatten: typeof Flatten;
      MaxPooling2D: typeof MaxPooling2D;
      Softmax: typeof Softmax;
    };
    losses: {
      SparseCategoricalCrossentropy: typeof SparseCategoricalCrossentropy;
    };
    models: {
      Sequential: typeof Sequential;
      load_model: (filepath: string, kwargs?: BoaKwargs) => Model;
    };
    preprocessing: {
      image: {
        img_to_array: (img: Image, kwargs?: BoaKwargs) => NumpyArray3D;
        load_img: (path: string, kwargs?: BoaKwargs) => Image;
      };
    };
  };
  export { keras as default, type Model };
}
