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
  console.log(body);
  return { value: 'hello world' };
};

const server = new Server(handler, {
  allowOrigin: (origin) => {
    const { hostname } = new URL(origin);
    return 'localhost' === hostname || '127.0.0.1' === hostname;
  },
});
server.start(3001);
