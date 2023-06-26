import random
import tensorflow as tf
from image import Image
from model import Model


default_pair_data = tf.keras.datasets.cifar10.load_data()
default_train_images_data = default_pair_data[0][0] / 255.0
default_train_labels_data = default_pair_data[0][1]
default_train_size = len(default_train_images_data)
default_test_images_data = default_pair_data[1][0] / 255.0
default_test_labels_data = default_pair_data[1][1]
default_test_size = len(default_test_images_data)
default_model_data = tf.keras.models.Sequential()
default_model_data.add(
    layer=tf.keras.layers.Conv2D(
        filters=32,
        kernel_size=(3, 3),
        activation='relu',
        input_shape=(32, 32, 3),
    ),
)
default_model_data.add(
    layer=tf.keras.layers.MaxPooling2D(
        pool_size=(2, 2),
    ),
)
default_model_data.add(
    layer=tf.keras.layers.Conv2D(
        filters=64,
        kernel_size=(3, 3),
        activation='relu',
    ),
)
default_model_data.add(
    layer=tf.keras.layers.MaxPooling2D(
        pool_size=(2, 2),
    ),
)
default_model_data.add(
    layer=tf.keras.layers.Conv2D(
        filters=64,
        kernel_size=(3, 3),
        activation='relu',
    ),
)
default_model_data.add(
    tf.keras.layers.Flatten(),
)
default_model_data.add(
    layer=tf.keras.layers.Dense(
        units=64,
        activation='relu',
    ),
)
default_model_data.add(
    layer=tf.keras.layers.Dense(
        units=10,
    ),
)
default_model_data.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(
        from_logits=True,
    ),
    metrics=['accuracy'],
)
default_model_data.fit(
    x=default_train_images_data,
    y=default_train_labels_data,
    epochs=10,
    validation_data=(default_test_images_data, default_test_labels_data),
)
test_loss, test_acc = default_model_data.evaluate(
    x=default_test_images_data,
    y=default_test_labels_data,
    verbose=2,
)
print()
print(f'loss: {test_loss}, accuracy: {test_acc}')
print()
default_model_data.summary()
print()
default_model = Model(default_model_data)


def load_default_model() -> Model:
    return default_model


def load_default_image(key: int) -> Image:
    return Image(default_test_images_data[key])


def load_default_label(key: int) -> int:
    return default_test_labels_data[key]


def load_default_pair() -> tuple[Image, int]:
    key = random.randint(0, default_test_size - 1)
    return load_default_image(key), load_default_label(key)
