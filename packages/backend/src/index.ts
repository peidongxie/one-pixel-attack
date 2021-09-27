import { getDefaultImage } from './image';
import { getDefaultLabel } from './label';
import { getDefaultModel } from './model';
import predict from './prediction';
import Server from './server';
import type { Handler } from './server';

const handler: Handler = async (req, res) => {
  const { getBody, getUrl } = req;
  const { setStatus } = res;
  if (getUrl().pathname !== '/') {
    setStatus(404);
    return null;
  }
  const body = await getBody();
  console.info(body);
  const key = Math.random();
  const image = await getDefaultImage(key);
  const label = await getDefaultLabel(key);
  const model = await getDefaultModel();
  const prediction = predict(model, image.tensor);
  return { image: image.value, label: label, prediction: prediction.top };
};

const server = new Server(handler, {
  allowOrigin: (origin) => {
    const { hostname } = new URL(origin);
    return 'localhost' === hostname || '127.0.0.1' === hostname;
  },
});
server.start(3001);
