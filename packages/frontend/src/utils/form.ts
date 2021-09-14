import { atom, selector } from 'recoil';

interface FormItem {
  name: string;
  value: string | Blob;
  fileName?: string;
}

interface Result {
  [key: string]: unknown;
}

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
        filename: 'raw',
      };
    }
    const imageIsNormalized = get(imageIsNormalizedState);
    return {
      name: 'image',
      value: imageFile,
      filename: imageIsNormalized ? 'normalized' : 'raw',
    };
  },
});

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
      filename: modelIsNormalized ? 'normalized' : 'raw',
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
    const image = get(imageState);
    if (image === null) return null;
    const model = get(modelState);
    if (model === null) return null;
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

const resultState = atom<Result | null>({
  key: 'resultState',
  default: null,
});

export {
  formState,
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
};
