import { Server as HttpServer } from 'http';
import type {
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'http';
import { Server as HttpsServer } from 'https';
import HandlerReq from './request';
import HandlerRes from './response';

export type Handler = (
  req: HandlerReq,
  res: HandlerRes,
) => Promise<void | Parameters<HandlerRes['setBody']>[0]>;

export interface CorsOptions {
  allowHeaders?: string;
  allowMethods?: string;
  allowOrigin?: (orgin: string) => boolean;
  maxAge?: number;
}

class Server {
  server: HttpServer | HttpsServer;

  constructor(handler: Handler, corsOptions?: CorsOptions) {
    const { allowHeaders, allowMethods, allowOrigin, maxAge } = {
      allowHeaders: '*',
      allowMethods: '*',
      allowOrigin: (origin: string) => !!origin,
      maxAge: 604800,
      ...corsOptions,
    };
    const requestListener = async (
      req: IncomingMessage,
      res: ServerResponse,
    ) => {
      const handlerReq = new HandlerReq(req);
      const handlerRes = new HandlerRes(res);
      const origin = handlerReq.getHeaders().origin || '';
      try {
        const headers: OutgoingHttpHeaders = { Vary: 'Origin' };
        if (!allowOrigin(origin)) {
          handlerRes.setCode(400);
          handlerRes.setHeaders(headers);
          handlerRes.setBody(null);
        } else if (handlerReq.getMethod() === 'OPTIONS') {
          headers['Access-Control-Allow-Credentials'] = 'true';
          headers['Access-Control-Allow-Headers'] = allowHeaders;
          headers['Access-Control-Allow-Methods'] = allowMethods;
          headers['Access-Control-Allow-Origin'] = origin;
          headers['Access-Control-Max-Age'] = maxAge;
          handlerRes.setHeaders(headers);
          handlerRes.setBody(null);
        } else {
          headers['Access-Control-Allow-Credentials'] = 'true';
          headers['Access-Control-Allow-Origin'] = origin;
          handlerRes.setHeaders(headers);
          const value = await handler(handlerReq, handlerRes);
          handlerRes.setBody(value ?? null);
        }
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
