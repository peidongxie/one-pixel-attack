import numpy as np
import tensorflow as tf


class Image:
    def __init__(self, data: np.ndarray | str) -> None:
        # data source
        if isinstance(data, str):
            if data.endswith('.npy'):
                self._data = np.load(data)
            else:
                self._data = tf.keras.preprocessing.image.img_to_array(
                    tf.keras.preprocessing.image.load_img(data),
                )
        elif isinstance(data, np.ndarray):
            self._data = data
        else:
            raise ValueError('Bad image')
        # data value
        if self._data.max() <= 1:
            self._data = self._data * 255
        if self._data.dtype != 'uint8':
            self._data = self._data.astype('uint8')
        # data shape
        shape = self._data.shape
        if len(shape) == 2:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = 1
            self._data = self._data.reshape(
                self._row,
                self._column,
                1,
            )
        elif len(shape) == 3:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = shape[2]
        else:
            raise ValueError('Bad image')

    @property
    def data(self) -> np.ndarray:
        return self._data

    @property
    def row(self) -> int:
        return self._row

    @property
    def column(self) -> int:
        return self._column

    @property
    def channel(self) -> int:
        return self._channel

    def perturb(self, pixels: np.ndarray | None = None) -> np.ndarray:
        if pixels == None:
            return self.data
        data = np.copy(self.data)
        for pixel in pixels:
            row, column, *colors = pixel
            for channel in range(len(colors)):
                data[row][column][channel] = colors[channel]
        return data
