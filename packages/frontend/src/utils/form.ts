import { atom, selector } from 'recoil';

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

const modelState = selector<FormItem | null>({
  key: 'modelState',
  get: ({ get }) => {
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
  },
});

const imageIsNumpyState = selector({
  key: 'imageIsNumpyState',
  get: ({ get }) => {
    const file = get(imageFileState);
    if (!file) return false;
    return file.name.endsWith('.npy');
  },
});

const imageState = selector<FormItem | null>({
  key: 'imageState',
  get: ({ get }) => {
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
  },
});

const labelState = selector<FormItem | null>({
  key: 'labelState',
  get: ({ get }) => {
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
  },
});

const perturbationState = selector<FormItem | null>({
  key: 'perturbationState',
  get: ({ get }) => {
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
  },
});

// form state

const formState = selector({
  key: 'formState',
  get: ({ get }) => {
    const model = get(modelState);
    if (model === null) return null;
    const image = get(imageState);
    if (image === null) return null;
    const label = get(labelState);
    if (label === null) return null;
    const perturbation = get(perturbationState);
    if (perturbation === null) return null;
    return [image, model, label, perturbation];
  },
});

const isValidState = selector({
  key: 'isValidState',
  get: ({ get }) => {
    const form = get(formState);
    return form !== null;
  },
});

// result data

const resultState = atom<Result | null>({
  key: 'resultState',
  default: null,
});

const shapeState = selector<[number, number, number, number, number]>({
  key: 'shapeState',
  get: ({ get }) => {
    const result = get(resultState);
    if (!result?.image) return [0, 0, 0, 0, 4];
    const rowFamily = result.image.length;
    const row = Math.ceil(200 / rowFamily);
    const columnFamily = result.image[0].length;
    const column = Math.ceil(200 / columnFamily);
    return [rowFamily, row, columnFamily, column, 4];
  },
});

const bufferState = selector({
  key: 'BufferState',
  get: ({ get }) => {
    const result = get(resultState);
    const [s0, s1, s2, s3, s4] = get(shapeState);
    const length = s0 * s1 * s2 * s3 * s4;
    const bufferBefore = new Uint8ClampedArray(length);
    if (result?.image) {
      for (let i0 = 0; i0 < s0; i0++) {
        for (let i1 = 0; i1 < s1; i1++) {
          for (let i2 = 0; i2 < s2; i2++) {
            for (let i3 = 0; i3 < s3; i3++) {
              const offset = (((i0 * s1 + i1) * s2 + i2) * s3 + i3) * s4;
              const [red, green, blue, alpha = 100] = result.image[i0][i2];
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
    if (result?.pixels) {
      for (const [i0, i2, red, green, blue, alpha = 100] of result.pixels) {
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

const imageBeforeState = selector({
  key: 'imageBeforeState',
  get: ({ get }) => {
    const [s0, s1, s2, s3, s4] = get(shapeState);
    const buffer = get(bufferState);
    if (s0 * s1 * s2 * s3 * s4) {
      return new ImageData(buffer[0], s2 * s3, s0 * s1);
    } else {
      return null;
    }
  },
});

const imageAfterState = selector({
  key: 'imageAfterState',
  get: ({ get }) => {
    const [s0, s1, s2, s3, s4] = get(shapeState);
    const buffer = get(bufferState);
    if (s0 * s1 * s2 * s3 * s4) {
      return new ImageData(buffer[1], s2 * s3, s0 * s1);
    } else {
      return null;
    }
  },
});

export {
  bufferState,
  formState,
  imageAfterState,
  imageBeforeState,
  imageFileState,
  imageIsDefaultState,
  imageIsNormalizedState,
  imageIsNumpyState,
  imageState,
  isValidState,
  labelIndexState,
  labelIsDefaultState,
  labelState,
  modelFileState,
  modelIsDefaultState,
  modelIsNormalizedState,
  modelState,
  perturbationIsDefaultState,
  perturbationPixelState,
  perturbationState,
  resultState,
  shapeState,
};
