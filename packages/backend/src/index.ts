import pi from './adversarial-attack';
import { getDefaultImage } from './machine-learning/image';
import { getDefaultLabel } from './machine-learning/label';
import { getDefaultModel } from './machine-learning/model';
import predict from './machine-learning/prediction';
import Server from './server';
import type { Handler } from './server';

console.error(pi);

const handler: Handler = async (req, res) => {
  const { getBody, getUrl } = req;
  const { setCode } = res;
  if (getUrl().pathname !== '/') {
    setCode(404);
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
