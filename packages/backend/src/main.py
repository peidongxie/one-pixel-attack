from load import load_default_model, load_default_pair, default_train_labels_data

model = load_default_model()
image, label = load_default_pair()
batch = image.create_batch()
prediction = model.predict(batch)


print('label')
print(label)
print()

print('prediction')
print(prediction)
