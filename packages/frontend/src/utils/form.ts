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

export {
  imageFileState,
  imageIsDefaultState,
  imageIsNormalizedState,
  imageIsNumpyState,
  imageState,
};
