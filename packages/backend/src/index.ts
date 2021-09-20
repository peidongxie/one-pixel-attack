import Server from './server';
import type { Handler } from './server';

const handler: Handler = async ({ body }, { send }) => {
  console.log(body);
  send('hello world');
};

const server = new Server(handler);
server.start(3001);
