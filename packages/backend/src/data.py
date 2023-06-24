import numpy as np
import tensorflow as tf


default_data = tf.keras.datasets.cifar10.load_data()
default_train_images = default_data[0][0] / 255.0
default_train_labels = default_data[0][1]
default_train_size = len(default_train_images)
default_test_images = default_data[1][0] / 255.0
default_test_labels = default_data[1][1]
default_test_size = len(default_test_images)
default_model = tf.keras.models.Sequential()
default_model.add(
    layer=tf.keras.layers.Conv2D(
        filters=32,
        kernel_size=(3, 3),
        activation='relu',
        input_shape=(32, 32, 3),
    ),
)
default_model.add(
    layer=tf.keras.layers.MaxPooling2D(
        pool_size=(2, 2),
    ),
)
default_model.add(
    layer=tf.keras.layers.Conv2D(
        filters=64,
        kernel_size=(3, 3),
        activation='relu',
    ),
)
default_model.add(
    layer=tf.keras.layers.MaxPooling2D(
        pool_size=(2, 2),
    ),
)
default_model.add(
    layer=tf.keras.layers.Conv2D(
        filters=64,
        kernel_size=(3, 3),
        activation='relu',
    ),
)
default_model.add(
    tf.keras.layers.Flatten(),
)
default_model.add(
    layer=tf.keras.layers.Dense(
        units=64,
        activation='relu',
    ),
)
default_model.add(
    layer=tf.keras.layers.Dense(
        units=10,
    ),
)
default_model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(
        from_logits=True,
    ),
    metrics=['accuracy'],
)
default_model.fit(
    x=default_train_images,
    y=default_train_labels,
    epochs=10,
    validation_data=(default_test_images, default_test_labels),
)
test_loss, test_acc = default_model.evaluate(
    x=default_test_images,
    y=default_test_labels,
    verbose=2,
)
print()
print(f'loss: {test_loss}, accuracy: {test_acc}')
print()
default_model.summary()
print()
