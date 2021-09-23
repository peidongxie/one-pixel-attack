import Server from './server';
import type { Handler } from './server';

const handler: Handler = async (req, res) => {
  const { getBody, getHeaders, getMethod, getUrl } = req;
  const { setBody, setHeader, setStatus, setType } = res;
  const origin = getHeaders().origin || getUrl().host;
  setHeader('Access-Control-Allow-Credentials', 'true');
  setHeader('Access-Control-Allow-Headers', '*');
  setHeader('Access-Control-Allow-Methods', '*');
  setHeader('Access-Control-Allow-Origin', origin);
  setHeader('Access-Control-Max-Age', '604800');
  if (getMethod() === 'OPTIONS') {
    return null;
  }
  if (getUrl().pathname !== '/') {
    setStatus(404);
    setType('text/plain; charset=utf-8');
    return 'Not Found';
  }
  const body = await getBody();
  console.log(body);
  setBody({ value: 'hello world' });
};

const server = new Server(handler);
server.start(3001);
