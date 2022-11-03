import np from 'py://numpy';
import AdversarialAttacker from './adversarial-attacker';
import ImageClassifierFactory from './image-classifier-factory';
import { Cors, Router, Server } from '@dest-toolkit/http-server';

const cors = new Cors();

const router = new Router();
router.setRoute('POST', '/', async (req) => {
  const { body } = req;
  const form = await body.formData();
  const model = form.get('model');
  const image = form.get('image');
  const label = form.get('label');
  const perturbation = form.get('perturbation');
  if (
    !model ||
    !image ||
    typeof label !== 'string' ||
    typeof perturbation !== 'string'
  ) {
    return {
      code: 400,
      body: null,
    };
  }
  const imageClassifier = await ImageClassifierFactory.createImageClassifier(
    model,
    image,
    label,
  );
  const adversarialAttacker = new AdversarialAttacker(
    imageClassifier,
    isNaN(Number(perturbation)) ? undefined : Number(perturbation),
  );
  return {
    body: {
      image: imageClassifier.getNormalized()
        ? np.around(np.multiply(imageClassifier.getImage(), 255))
        : imageClassifier.getImage(),
      pixels: adversarialAttacker.attack(),
      predictions: [
        imageClassifier.getPrediction(),
        adversarialAttacker.getPrediction() || [],
      ],
    },
  };
});

const server = new Server('http');
server.use(cors);
server.use(router);
server.listen(3001, '::');
