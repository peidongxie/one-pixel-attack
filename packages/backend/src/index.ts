import np from 'py:numpy';
import AdversarialAttacker from './adversarial-attacker';
import ImageClassifierFactory from './image-classifier-factory';
import Server from './server';
import type { Handler, MultipartFile } from './server';

interface Body {
  image: 'default' | MultipartFile;
  model: 'default' | MultipartFile;
  label: string;
  perturbation: string;
}

const handler: Handler = async (req) => {
  const { getBody, getMethod, getUrl } = req;
  if (getMethod() === 'OPTIONS') return;
  if (getUrl().pathname !== '/') return { code: 404 };
  const body = await getBody<Body>();
  if (!body) return { code: 400 };
  console.info(body);
  const imageClassifier = ImageClassifierFactory.createImageClassifier(
    body.image,
    body.model,
    body.label,
  );
  const adversarialAttacker = new AdversarialAttacker(
    imageClassifier,
    isNaN(Number(body.perturbation)) ? undefined : Number(body.perturbation),
  );
  const image = imageClassifier.getNormalized()
    ? np.around(np.multiply(imageClassifier.getImage(), 255))
    : imageClassifier.getImage();
  const label = imageClassifier.getLabel();
  const pixels = adversarialAttacker.attack();
  const predictions = [
    imageClassifier.getPrediction(),
    adversarialAttacker.getPrediction() || [],
  ];
  return {
    body: { image, label, pixels, predictions },
  };
};

const server = new Server(handler);
server.start(3001);
