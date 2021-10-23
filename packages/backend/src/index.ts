import np from 'py:numpy';
import { getImage, getModel, getPrediction } from './machine-learning';
import { getDefaultLabel } from './machine-learning/default';
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
  const input = { ...body, key: Math.random() };
  const image = getImage(input);
  const label = getDefaultLabel(input.key);
  const model = getModel(input);
  const prediction = getPrediction(model, image);
  console.log(prediction.tolist());
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
