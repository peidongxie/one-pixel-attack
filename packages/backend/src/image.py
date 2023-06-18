import numpy as np
import tensorflow as tf


class Image:
    def __init__(self, data: np.ndarray | str) -> None:
        if type(data) is not str:
            self._data = data
        elif data.endswith(
            suffix='.npy',
        ):
            self._data = np.load(
                file=data,
            )
        else:
            self._data = tf.keras.preprocessing.image.img_to_array(
                img=tf.keras.preprocessing.image.load_img(
                    path=data,
                ),
            )
        shape = self._data.shape
        if len(shape) is 2:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = 1
            self._data = self._data.reshape(
                self._row,
                self._column,
                1,
            )
        elif len(shape) is 3:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = shape[2]
        else:
            raise ValueError("Bad image")
        max_value = 1
        for value in np.nditer(
            op=self._data,
        ):
            if value > 1:
                max_value = 255
                break
        self._data = (self._data * (255 / max_value)).astype(
            dtype='uint8',
        )

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

    def generate(self, pixels: np.ndarray) -> 'Image':
        data = np.copy(self.data)
        for pixel in pixels:
            row, column, *colors = pixel
            for channel in range(len(colors)):
                data[row][column][channel] = colors[channel]
        return Image(
            data=data,
        )
