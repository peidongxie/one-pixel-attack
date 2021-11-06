import np from 'py:numpy';
import AdversarialAttacker from './adversarial-attacker';
import ImageClassifier from './image-classifier';
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
  const image = imageClassifier.normalized
    ? np.around(np.multiply(imageClassifier.image, 255)).tolist()
    : imageClassifier.image.tolist();
  const label = imageClassifier.label;
  const pixels = adversarialAttacker.attack().tolist();
  const predictions = [
    imageClassifier.getPrediction().tolist(),
    adversarialAttacker.getPrediction()?.tolist() || [],
  ];
  return {
    body: { image, label, pixels, predictions },
  };
};

const server = new Server(handler);
server.start(3001);
