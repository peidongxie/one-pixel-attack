import Server from './server';
import type { Handler } from './server';

const handler: Handler = async (req, res) => {
  const origin = req.getHeaders().origin || req.getUrl().host;
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Max-Age', '604800');
  if (req.getMethod() === 'OPTIONS') return null;
  if (req.getUrl().pathname !== '/') {
    res.setCode(404);
    res.setBody(null);
  }
  return { value: 'hello world' };
};

const server = new Server(handler);
server.start(3001);
