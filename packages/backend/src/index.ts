import np from 'py:numpy';
import AdversarialAttacker from './adversarial-attacker';
import ImageClassifierFactory from './image-classifier-factory';
import { Server, type Handler, type MultipartFile } from './wrap-http';

interface Body {
  model: 'default' | MultipartFile;
  image: 'default' | MultipartFile;
  label: string;
  perturbation: string;
}

const handler: Handler = async (req) => {
  const body = await req.getBody<Body>();
  if (!body) return { code: 400 };
  console.info(body);
  const imageClassifier = ImageClassifierFactory.createImageClassifier(
    body.model,
    body.image,
    body.label,
  );
  const adversarialAttacker = new AdversarialAttacker(
    imageClassifier,
    isNaN(Number(body.perturbation)) ? undefined : Number(body.perturbation),
  );
  const image = imageClassifier.getNormalized()
    ? np.around(np.multiply(imageClassifier.getImage(), 255))
    : imageClassifier.getImage();
  const pixels = adversarialAttacker.attack();
  const predictions = [
    imageClassifier.getPrediction(),
    adversarialAttacker.getPrediction() || [],
  ];
  return {
    body: { image, pixels, predictions },
  };
};

const server = new Server();
server.cors();
server.route('POST', new RegExp('^/$'), handler);
server.listen(3001, '::');
