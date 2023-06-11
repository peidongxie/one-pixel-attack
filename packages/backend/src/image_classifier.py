import numpy as np
import os
import random
import tensorflow as tf


def add_softmax_layer(model: tf.keras.models.Sequential) -> tf.keras.models.Sequential:
    return tf.keras.models.Sequential(
        layers=[
            model,
            tf.keras.layers.Softmax(),
        ],
    )


def load_model() -> tf.keras.models.Sequential:
    model = tf.keras.models.load_model(model_path)
    model.summary()
    print()
    return add_softmax_layer(
        model=model,
    )


def train_model() -> tf.keras.models.Sequential:
    model = tf.keras.models.Sequential()
    model.add(
        layer=tf.keras.layers.Conv2D(
            filters=32,
            kernel_size=(3, 3),
            activation='relu',
            input_shape=(32, 32, 3),
        ),
    )
    model.add(
        layer=tf.keras.layers.MaxPooling2D(
            pool_size=(2, 2),
        ),
    )
    model.add(
        layer=tf.keras.layers.Conv2D(
            filters=64,
            kernel_size=(3, 3),
            activation='relu',
        ),
    )
    model.add(
        layer=tf.keras.layers.MaxPooling2D(
            pool_size=(2, 2)
        ),
    )
    model.add(
        layer=tf.keras.layers.Conv2D(
            filters=64,
            kernel_size=(3, 3),
            activation='relu',
        ),
    )
    model.add(
        tf.keras.layers.Flatten(),
    )
    model.add(
        layer=tf.keras.layers.Dense(
            units=64,
            activation='relu',
        ),
    )
    model.add(
        layer=tf.keras.layers.Dense(
            units=10,
        ),
    )
    model.add(
        layer=tf.keras.layers.Softmax(),
    )
    model.compile(
        optimizer='adam',
        loss=tf.keras.losses.SparseCategoricalCrossentropy(
            from_logits=True,
        ),
        metrics=['accuracy'],
    )
    model.fit(
        x=train_images,
        y=train_labels,
        epochs=1,
        validation_data=(test_images, test_labels),
    )
    test_loss, test_acc = model.evaluate(
        x=test_images,
        y=test_labels,
        verbose=2,
    )
    print()
    print(f'loss: {test_loss}, accuracy: {test_acc}')
    print()
    model.summary()
    print()
    return add_softmax_layer(
        model=model,
    )


class ImageClassifier:
    def __init__(self, model: str | None = None, image: str | None = None) -> None:
        if model is None:
            self.model = model
            self.model_normalized = True
        else:
            self.model = add_softmax_layer(
                model=tf.keras.models.load_model(
                    filepath=model,
                ),
            )
            self.model_normalized = not model.endswith('raw.h5')
        if image is None:
            key = random.randint(0, data_size - 1)
            self.image = test_images[key]
            self.image_normalized = True
            self.label = test_labels[key]
        elif image.endswith('.npy'):
            self.image = np.load(image).astype(dtype='float32')
            self.image_normalized = not image.endswith('raw.npy')
            self.label = None
        else:
            self.image = tf.keras.preprocessing.image.img_to_array(
                img=tf.keras.preprocessing.image.load_img(image),
                dtype='float32',
            )
            self.image_normalized = False
            self.label = None


data = tf.keras.datasets.cifar10.load_data()
train_images = (data[0][0] / 255.0).astype(dtype='float32')
train_labels = data[0][1]
test_images = (data[1][0] / 255.0).astype(dtype='float32')
test_labels = data[1][1]
data_size = len(test_labels)
model_path = './public/model.h5'
model = load_model() if os.access(path=model_path, mode=os.F_OK) else train_model()

print(data_size)
