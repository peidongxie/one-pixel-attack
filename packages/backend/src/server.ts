import { Server as HttpServer } from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';
import HandlerReq from './request';
import HandlerRes from './response';

export type Handler = <Body = unknown>(
  req: HandlerReq<Body>,
  res: HandlerRes,
) => Promise<void | Parameters<HandlerRes['setBody']>[0]>;
class Server {
  server: HttpServer | HttpsServer;

  constructor(handler: Handler) {
    const requestListener = async (
      req: IncomingMessage,
      res: ServerResponse,
    ) => {
      const handlerReq = new HandlerReq(req);
      const handlerRes = new HandlerRes(res);
      try {
        const handlerValue = await handler(handlerReq, handlerRes);
        handlerRes.setBody(handlerValue ?? null);
      } catch (e) {
        handlerRes.setCode(500);
        if (e instanceof Error) handlerRes.setBody(e);
        else handlerRes.setBody('Internal Server Error');
      }
    };
    const server = new HttpServer(requestListener);
    this.server = server;
  }

  start(port?: number): void {
    this.server.listen(port || (this.server instanceof HttpsServer ? 443 : 80));
  }
}

export default Server;
