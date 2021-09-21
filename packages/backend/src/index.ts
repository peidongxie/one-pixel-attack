import Server from './server';
import type { Handler } from './server';

const handler: Handler = async (
  { body, headers, method, url },
  { send, setHeader },
) => {
  setHeader('Access-Control-Allow-Credentials', 'true');
  setHeader('Access-Control-Allow-Headers', '*');
  setHeader('Access-Control-Allow-Methods', '*');
  setHeader('Access-Control-Allow-Origin', headers.origin || url.host);
  setHeader('Access-Control-Max-Age', '604800');
  if (method === 'OPTIONS') return null;
  if (url.pathname !== '/') send(null, 404);
  console.log(body, headers, url);
  return { value: 'hello world' };
};

const server = new Server(handler);
server.start(3001);
