import { Server as HttpServer } from 'http';
import type { IncomingMessage, RequestListener, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';
import type { Stream } from 'stream';
import { receive } from './receive';
import { send, sendError } from './send';
import type { StrictJsonItem } from './send';

export type MethodSend = (
  value?: null | string | Error | Buffer | Stream | StrictJsonItem,
  code?: number,
  type?: string,
  length?: number,
) => void;

export type Handler = <Body = unknown>(
  data: { body: Body },
  method: { send: MethodSend },
  ctx: {
    req: IncomingMessage;
    res: ServerResponse;
  },
) => Promise<void | null | string | Error | Buffer | Stream | StrictJsonItem>;

class Server {
  server: HttpServer | HttpsServer;

  constructor(handler: Handler) {
    const requestListener: RequestListener = async (req, res) => {
      let isSent = false;
      try {
        const body = await receive(req);
        const data = { body };
        const method = {
          send: (
            value?: null | string | Error | Buffer | Stream | StrictJsonItem,
            code?: number,
            type?: string,
            length?: number,
          ) => {
            send(res, value, code, type, length);
            isSent = true;
          },
        };
        const ctx = { req, res };
        const value = await handler(data, method, ctx);
        if (!isSent) {
          if (value === undefined) method.send();
          else method.send(value);
        }
      } catch (e) {
        if (!isSent) {
          if (e instanceof Error) sendError(res, e);
          else sendError(res, new Error('Internal Server Error'));
        }
      }
    };
    const server = new HttpServer(requestListener);
    this.server = server;
  }

  start(port?: number): void {
    this.server.listen(port || 3000);
  }
}

export default Server;
