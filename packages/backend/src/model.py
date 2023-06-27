import numpy as np
import tensorflow as tf
from image import Image


class Model:
    def __init__(self, data: tf.keras.models.Model | str) -> None:
        # data source
        if isinstance(data, str):
            self._data = tf.keras.models.load_model(
                filepath=data,
            )
        elif isinstance(data, tf.keras.models.Model):
            self._data = data
        else:
            raise ValueError("Bad model")
        # data value
        if len(self._data.layers) == 0:
            raise ValueError("Bad model")
        if not isinstance(self._data.layers[0], tf.keras.layers.Rescaling):
            self._data = tf.keras.models.Sequential(
                layers=[
                    tf.keras.layers.Rescaling(
                        scale=1./255,
                        input_shape=self._data.layers[0].input_shape[1:],
                    ),
                    self._data,
                ],
            )
        # data shape
        shape = self._data.layers[0].input_shape[1:]
        if len(shape) == 2:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = 1
            self._data = tf.keras.models.Sequential(
                layers=[
                    tf.keras.layers.Reshape(
                        target_shape=shape,
                        input_shape=(self._row, self._column, 1),
                    ),
                    self._data,
                ],
            )
        elif len(shape) == 3:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = shape[2]
        else:
            raise ValueError("Bad model")

    @property
    def data(self) -> tf.keras.models.Model:
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

    def predict(self, batch: np.ndarray) -> np.ndarray:
        return self.data.predict(batch)
