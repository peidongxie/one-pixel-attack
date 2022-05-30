import { atom, atomFamily, selector, selectorFamily } from 'recoil';

interface FormItem {
  name: string;
  value: string | Blob;
  fileName?: string;
}

interface Result {
  image: [number, number, number][][];
  pixels: [number, number, number, number, number][];
  predictions: [number[], number[]];
}

// model control

const modelIsDefaultState = atom({
  key: 'modelIsDefaultState',
  default: false,
});

const modelFileState = atom<File | null>({
  key: 'modelFileState',
  default: null,
});

const modelIsNormalizedState = atom({
  key: 'modelIsNormalizedState',
  default: true,
});

// image control

const imageIsDefaultState = atom({
  key: 'imageIsDefaultState',
  default: false,
});

const imageFileState = atom<File | null>({
  key: 'imageIsFileState',
  default: null,
});

const imageIsNormalizedState = atom({
  key: 'imageIsNormalizedState',
  default: true,
});

const imageIsNumpyState = selector({
  key: 'imageIsNumpyState',
  get: ({ get }) => {
    const file = get(imageFileState);
    if (!file) return false;
    return file.name.endsWith('.npy');
  },
});

// label control

const labelIsDefaultState = atom({
  key: 'labelIsDefaultState',
  default: false,
});

const labelIndexState = atom({
  key: 'labelIndexState',
  default: 0,
});

// perturbation control

const perturbationIsDefaultState = atom({
  key: 'perturbationIsDefaultState',
  default: false,
});

const perturbationPixelState = atom({
  key: 'perturbationPixelState',
  default: 7,
});

// form field

const formFieldState = selectorFamily<
  FormItem | null,
  'model' | 'image' | 'label' | 'perturbation'
>({
  key: 'formFieldState',
  get:
    (field) =>
    ({ get }) => {
      switch (field) {
        case 'model': {
          const modelIsDefault = get(modelIsDefaultState);
          if (modelIsDefault) {
            return {
              name: 'model',
              value: 'default',
            };
          }
          const modelFile = get(modelFileState);
          if (!modelFile) return null;
          const modelIsNormalized = get(modelIsNormalizedState);
          return {
            name: 'model',
            value: modelFile,
            fileName: modelIsNormalized ? 'normalized.h5' : 'raw.h5',
          };
        }
        case 'image': {
          const imageIsDefault = get(imageIsDefaultState);
          if (imageIsDefault) {
            return {
              name: 'image',
              value: 'default',
            };
          }
          const imageFile = get(imageFileState);
          if (!imageFile) return null;
          const imageIsNumpy = get(imageIsNumpyState);
          if (!imageIsNumpy) {
            return {
              name: 'image',
              value: imageFile,
              fileName: 'raw.png',
            };
          }
          const imageIsNormalized = get(imageIsNormalizedState);
          return {
            name: 'image',
            value: imageFile,
            fileName: imageIsNormalized ? 'normalized.npy' : 'raw.npy',
          };
        }
        case 'label': {
          const labelIsDefault = get(labelIsDefaultState);
          if (labelIsDefault) {
            return {
              name: 'label',
              value: 'default',
            };
          }
          const labelIndex = get(labelIndexState);
          if (isNaN(labelIndex)) return null;
          return {
            name: 'label',
            value: String(labelIndex),
          };
        }
        case 'perturbation': {
          const perturbationIsDefault = get(perturbationIsDefaultState);
          if (perturbationIsDefault) {
            return {
              name: 'perturbation',
              value: 'default',
            };
          }
          const perturbationPixel = get(perturbationPixelState);
          if (isNaN(perturbationPixel)) return null;
          return {
            name: 'perturbation',
            value: String(perturbationPixel),
          };
        }
        default:
          return null;
      }
    },
});

const formState = selector({
  key: 'formState',
  get: ({ get }) => {
    const formData = new FormData();
    for (const field of ['model', 'image', 'label', 'perturbation'] as const) {
      const item = get(formFieldState(field));
      if (item === null) return null;
      const { name, value, fileName } = item;
      if (fileName) formData.append(name, value, fileName);
      else formData.append(name, value);
    }
    return formData;
  },
});

// query

const queryIdState = atom({
  key: 'queryIdState',
  default: -1,
});

const queryInputState = atomFamily<FormData | null, number>({
  key: 'queryInputState',
  default: null,
});

const queryOutputState = selectorFamily<Result | null, number>({
  key: 'queryOutputState',
  get:
    (id) =>
    async ({ get }) => {
      const input = get(queryInputState(id));
      if (input === null) return null;
      const url = new URL(globalThis.location.origin);
      url.port = '3001';
      const response = await fetch(url.origin, {
        body: input,
        method: 'POST',
      });
      return response.json();
    },
});

// result data

const shapeState = selectorFamily<
  [number, number, number, number, number],
  number
>({
  key: 'shapeState',
  get:
    (id) =>
    ({ get }) => {
      const output = get(queryOutputState(id));
      if (!output?.image) return [0, 0, 0, 0, 4];
      const rowFamily = output.image.length;
      const row = Math.ceil(200 / rowFamily);
      const columnFamily = output.image[0].length;
      const column = Math.ceil(200 / columnFamily);
      return [rowFamily, row, columnFamily, column, 4];
    },
});

const bufferState = selectorFamily<
  [Uint8ClampedArray, Uint8ClampedArray],
  number
>({
  key: 'BufferState',
  get:
    (id) =>
    ({ get }) => {
      const output = get(queryOutputState(id));
      const [s0, s1, s2, s3, s4] = get(shapeState(id));
      const length = s0 * s1 * s2 * s3 * s4;
      const bufferBefore = new Uint8ClampedArray(length);
      if (output?.image) {
        for (let i0 = 0; i0 < s0; i0++) {
          for (let i1 = 0; i1 < s1; i1++) {
            for (let i2 = 0; i2 < s2; i2++) {
              for (let i3 = 0; i3 < s3; i3++) {
                const offset = (((i0 * s1 + i1) * s2 + i2) * s3 + i3) * s4;
                const [red, green, blue, alpha = 255] = output.image[i0][i2];
                bufferBefore[offset] = red;
                bufferBefore[offset + 1] = green;
                bufferBefore[offset + 2] = blue;
                bufferBefore[offset + 3] = alpha;
              }
            }
          }
        }
      }
      const bufferAfter = new Uint8ClampedArray(bufferBefore);
      if (output?.pixels) {
        for (const [i0, i2, red, green, blue, alpha = 255] of output.pixels) {
          for (let i1 = 0; i1 < s1; i1++) {
            for (let i3 = 0; i3 < s3; i3++) {
              const offset = (((i0 * s1 + i1) * s2 + i2) * s3 + i3) * s4;
              bufferAfter[offset] = red;
              bufferAfter[offset + 1] = green;
              bufferAfter[offset + 2] = blue;
              bufferAfter[offset + 3] = alpha;
            }
          }
        }
      }
      return [bufferBefore, bufferAfter];
    },
});

const imagesState = selectorFamily<
  [ImageData, ImageData] | [null, null],
  number
>({
  key: 'imagesState',
  get:
    (id) =>
    ({ get }) => {
      const [s0, s1, s2, s3, s4] = get(shapeState(id));
      const buffer = get(bufferState(id));
      if (s0 * s1 * s2 * s3 * s4) {
        return [
          new ImageData(buffer[0], s2 * s3, s0 * s1),
          new ImageData(buffer[1], s2 * s3, s0 * s1),
        ];
      } else {
        return [null, null];
      }
    },
});

const predictionsState = selectorFamily<[number[], number[], string[]], number>(
  {
    key: 'predictionsState',
    get:
      (id) =>
      ({ get }) => {
        const output = get(queryOutputState(id));
        if (!output?.predictions) return [[], [], []];
        const [predictionBefore, predictionAfter] = output.predictions;
        const label = predictionBefore.map((value, index) => 'C' + index);
        return [predictionBefore, predictionAfter, label];
      },
  },
);

export {
  bufferState,
  formState,
  formFieldState,
  imageFileState,
  imageIsDefaultState,
  imageIsNormalizedState,
  imageIsNumpyState,
  imagesState,
  labelIndexState,
  labelIsDefaultState,
  modelFileState,
  modelIsDefaultState,
  modelIsNormalizedState,
  perturbationIsDefaultState,
  perturbationPixelState,
  predictionsState,
  queryIdState,
  queryInputState,
  queryOutputState,
  shapeState,
};
