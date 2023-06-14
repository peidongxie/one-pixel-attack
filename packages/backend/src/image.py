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
        self._normalized = True
        for element in np.nditer(
            op=self._data,
        ):
            if element > 1:
                self._normalized = False
        if self._normalized:
            self._data = self._data.astype(
                dtype='uint8',
            )
        else:
            self._data = self._data.astype(
                dtype='float32',
            )
        self._row = self._data.shape[0]
        self._column = self._data.shape[1]
        self._channel = self._data.shape[2]

    @property
    def data(self) -> np.ndarray:
        return self._data

    @property
    def normalized(self) -> bool:
        return self._normalized

    @property
    def row(self) -> int:
        return self._row

    @property
    def column(self) -> int:
        return self._column

    @property
    def channel(self) -> int:
        return self._channel
