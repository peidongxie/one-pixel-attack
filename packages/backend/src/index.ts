import np from 'py:numpy';
import {
  getDefaultImage,
  getDefaultLabel,
  getDefaultModel,
} from './machine-learning/default';
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
  console.info(body);
  const key = Math.random();
  const image = getDefaultImage(key);
  const label = getDefaultLabel(key);
  // const model = getDefaultModel();
  return {
    body: {
      image: np.around(np.multiply(image, 255)).tolist(),
      label: label,
      perturbation: null,
      prediction: null,
    },
  };
};

const server = new Server(handler);
server.start(3001);
