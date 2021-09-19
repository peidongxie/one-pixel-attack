import { Server } from 'http';
import type { IncomingMessage, RequestListener, ServerResponse } from 'http';
import { send, sendError } from './send';

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  send(res, 'hello world');
};

const requestListener: RequestListener = async (req, res) => {
  try {
    await handler(req, res);
  } catch (e) {
    if (e instanceof Error) {
      const message = e.message;
      if (message === '') sendError(res, e, 400);
      else sendError(res, e);
    }
  }
};

const server = new Server(requestListener);
server.listen(3001);
