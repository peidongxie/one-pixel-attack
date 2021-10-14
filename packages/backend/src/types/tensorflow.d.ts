declare module 'py:tensorflow' {
  import type { NumpyArray2D, NumpyArray4D } from 'py:numpy';
  export interface Layer {
    [key: string]: unknown;
  }
  export interface Loss {
    [key: string]: unknown;
  }
  export class Sequential {
    add: (layer: Layer) => void;
    compile: (kwargs?: BoaKwargs) => void;
    evaluate: (kwargs?: BoaKwargs) => [number, number];
    fit: (kwargs?: BoaKwargs) => void;
    summary: (kwargs?: BoaKwargs) => void;
  }
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
        Conv2D: (
          filters: number,
          kernel_size: number | [number, number],
          kwargs?: BoaKwargs,
        ) => Layer;
        Dense: (units: number, kwargs?: BoaKwargs) => Layer;
        Flatten: (kwargs?: BoaKwargs) => Layer;
        MaxPooling2D: (kwargs?: BoaKwargs) => Layer;
      };
      losses: {
        SparseCategoricalCrossentropy: (kwargs?: BoaKwargs) => Loss;
      };
      models: {
        Sequential: (kwargs?: BoaKwargs) => Sequential;
      };
    };
  };
  export default tf;
}
