import pi from './adversarial-attack';
import { getDefaultImage } from './machine-learning/image';
import { getDefaultLabel } from './machine-learning/label';
import { getDefaultModel } from './machine-learning/model';
import predict from './machine-learning/prediction';
import Server from './server';
import type { Handler, MultipartFile } from './server';

console.error(pi);

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
  console.info(body);
  const key = Math.random();
  const image = await getDefaultImage(key);
  const label = await getDefaultLabel(key);
  const model = await getDefaultModel();
  const prediction = predict(model, image.tensor);
  return {
    body: { image: image.value, label: label, prediction: prediction.top },
  };
};

const server = new Server(handler);
server.start(3001);
