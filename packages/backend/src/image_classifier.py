import numpy as np
import os
import tensorflow as tf


def load_model() -> tf.keras.models.Sequential:
    return tf.keras.models.load_model(model_path)


def train_model() -> tf.keras.models.Sequential:
    model = tf.keras.models.Sequential(
        layers=[
            tf.keras.layers.Conv2D(
                filters=32,
                kernel_size=(3, 3),
                activation='relu',
                input_shape=(32, 32, 3),
            ),
            tf.keras.layers.MaxPooling2D(
                pool_size=(2, 2),
            ),
            tf.keras.layers.Conv2D(
                filters=64,
                kernel_size=(3, 3),
                activation='relu'
            ),
            tf.keras.layers.MaxPooling2D(
                pool_size=(2, 2)
            ),
            tf.keras.layers.Conv2D(
                filters=64,
                kernel_size=(3, 3),
                activation='relu'
            ),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(
                units=64,
                activation='relu',
            ),
            tf.keras.layers.Dense(
                10,
            ),
        ]
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
        epochs=10,
        validation_data=(test_images, test_labels),
    )
    test_loss, test_acc = model.evaluate(
        x=test_images, y=test_labels, verbose=2)
    print()
    print(f'loss: {test_loss}, accuracy: {test_acc}')
    print()
    return model


data = tf.keras.datasets.cifar10.load_data()
train_images = (data[0][0] / 255.0).astype(dtype='float32')
train_labels = data[0][1]
test_images = (data[1][0] / 255.0).astype(dtype='float32')
test_labels = data[1][1]

model_path = './public/model.h5'
model = load_model() if os.access(path=model_path, mode=os.F_OK) else train_model()
model.summary()
