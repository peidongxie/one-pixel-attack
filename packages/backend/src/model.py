import numpy as np
import tensorflow as tf


class Model:
    def __init__(self, data: tf.keras.models.Sequential | str) -> None:
        # data source
        if type(data) is not str:
            self._data = data
        else:
            self._data = tf.keras.models.load_model(
                filepath=data,
            )
        # data value
        if not isinstance(self._data.layers[0], tf.keras.layers.Rescaling):
            self._data = tf.keras.models.Sequential(
                layers=[
                    tf.keras.layers.Rescaling(
                        scale=1./255,
                        input_shape=self._data.layers[0].input_shape,
                    ),
                    self._data,
                ],
            )
        # data shape
        shape = self._data.layers[0].input_shape
        if len(shape) is 2:
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
        elif len(shape) is 3:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = shape[2]
        else:
            raise ValueError("Bad model")
