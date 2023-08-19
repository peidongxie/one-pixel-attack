import numpy as np
import tensorflow as tf
from image import Image


class Model:
    def __init__(self, data: tf.keras.models.Model | str) -> None:
        # data source
        if isinstance(data, str):
            self._data = tf.keras.models.load_model(data)
        elif isinstance(data, tf.keras.models.Model):
            self._data = data
        else:
            raise ValueError('Bad model')
        # data value
        if len(self._data.layers) == 0:
            raise ValueError('Bad model')
        if not isinstance(self._data.layers[0], tf.keras.layers.Rescaling):
            self._data = tf.keras.models.Sequential(
                layers=[
                    tf.keras.layers.Rescaling(
                        input_shape=self._data.layers[0].input_shape[1:],
                        scale=1./255,
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
                        input_shape=(self._row, self._column, 1),
                        target_shape=shape,
                    ),
                    self._data,
                ],
            )
        elif len(shape) == 3:
            self._row = shape[0]
            self._column = shape[1]
            self._channel = shape[2]
        else:
            raise ValueError('Bad model')

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

    def predict(self, image_data: np.ndarray, softmax: bool = False) -> np.ndarray:
        batch = np.expand_dims(
            a=image_data,
            axis=0,
        )
        prediction = self.data.predict(batch)[0]
        if softmax == False:
            return prediction
        max_value = np.max(prediction)
        min_value = np.min(prediction)
        sum_value = np.sum(prediction)
        if max_value <= 1 and min_value >= 0 and sum_value <= 1.01 and sum_value >= 0.99:
            return prediction
        prediction = np.exp(prediction - max_value)
        sum_value = np.sum(prediction)
        prediction = prediction / sum_value
        return prediction
