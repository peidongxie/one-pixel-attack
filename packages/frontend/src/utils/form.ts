import { atom, selector } from 'recoil';

const imageIsDefaultState = atom({
  key: 'imageIsDefaultState',
  default: true,
});

const imageFileState = atom<File | null>({
  key: 'imageIsFileState',
  default: null,
});

const imageIsNormalizedState = atom({
  key: 'imageIsNormalizedState',
  default: true,
});

const modelIsDefaultState = atom({
  key: 'modelIsDefaultState',
  default: true,
});

const modelFileState = atom<File | null>({
  key: 'modelFileState',
  default: null,
});

const modelIsNormalizedState = atom({
  key: 'modelIsNormalizedState',
  default: true,
});

const labelIsDefaultState = atom({
  key: 'labelIsDefaultState',
  default: true,
});

const labelIndexState = atom<number>({
  key: 'labelIndexState',
  default: 0,
});

const imageIsNumpyState = selector({
  key: 'imageIsNumpyState',
  get: ({ get }) => {
    const file = get(imageFileState);
    if (!file) return false;
    return file.name.endsWith('.npy');
  },
});

const imageState = selector({
  key: 'imageState',
  get: ({ get }) => {
    const isDefault = get(imageIsDefaultState);
    const file = get(imageFileState);
    const isNormalized = get(imageIsNormalizedState);
    const isNumpy = get(imageIsNumpyState);
    return {
      isDefault,
      file: isDefault ? null : file,
      isNormalized: isDefault || !isNumpy ? true : isNormalized,
    };
  },
});

const modelState = selector({
  key: 'modelState',
  get: ({ get }) => {
    const isDefault = get(modelIsDefaultState);
    const file = get(modelFileState);
    const isNormalized = get(modelIsNormalizedState);
    return {
      isDefault,
      file: isDefault ? null : file,
      isNormalized: isDefault ? true : isNormalized,
    };
  },
});

const labelState = selector({
  key: 'labelState',
  get: ({ get }) => {
    const isDefault = get(labelIsDefaultState);
    const index = get(labelIndexState);
    return {
      isDefault,
      index: isDefault ? -1 : index,
    };
  },
});

export {
  imageFileState,
  imageIsDefaultState,
  imageIsNormalizedState,
  imageIsNumpyState,
  imageState,
  labelIndexState,
  labelIsDefaultState,
  labelState,
  modelFileState,
  modelIsDefaultState,
  modelIsNormalizedState,
  modelState,
};
