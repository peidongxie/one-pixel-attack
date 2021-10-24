import np from 'py:numpy';
import {
  getImage,
  getLabel,
  getModel,
  getPrediction,
} from './machine-learning';
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
  const key = Math.random();
  const image = getImage(body.image === 'default' ? key : body.image);
  const model = getModel(body.model === 'default' ? undefined : body.model);
  const prediction = getPrediction(model, image);
  const label = getLabel(
    body.image === 'default'
      ? key
      : body.label === 'default'
      ? prediction
      : body.label,
  );
  return {
    body: {
      image: np.around(np.multiply(image, 255)).tolist(),
      label: label,
      perturbation: null,
      prediction: prediction.tolist(),
    },
  };
};

const server = new Server(handler);
server.start(3001);
