from load import load_default_model, load_default_pair
from image import Image
from model import Model


def main(
    model_option: str,
    image_option: str,
    label_option: str,
    perturbation_option: str,
):
    if model_option == '':
        model = load_default_model()
    else:
        model = Model(model_option)
    if label_option == '':
        label = -1
    else:
        label = int(label_option)
    if image_option == '':
        image, label = load_default_pair()
    else:
        image = Image(image_option)
    if perturbation_option == '':
        perturbation = max(int(image.row * image.column * 0.01), 1)
    else:
        perturbation = int(perturbation_option)

    batch = image.perturb()
    prediction = model.predict(batch, True)

    print(model)
    print(image)
    print(label)
    print(perturbation)
    print(prediction)


main('', '', '', '')
