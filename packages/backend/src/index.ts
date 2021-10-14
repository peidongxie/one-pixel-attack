import { getDefaultImage, getDefaultLabel } from './machine-learning/default';
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
  return {
    body: { image: getDefaultImage(key), label: getDefaultLabel(key) },
  };
};

const server = new Server(handler);
server.start(3001);
