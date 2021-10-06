import { Server as HttpServer } from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
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
        handlerRes.setHeader('Vary', 'Origin');
        if (!allowOrigin(origin)) {
          handlerRes.setStatus(400);
          handlerRes.setBody(null);
        } else if (handlerReq.getMethod() === 'OPTIONS') {
          handlerRes.setHeader('Access-Control-Allow-Credentials', 'true');
          handlerRes.setHeader('Access-Control-Allow-Headers', allowHeaders);
          handlerRes.setHeader('Access-Control-Allow-Methods', allowMethods);
          handlerRes.setHeader('Access-Control-Allow-Origin', origin);
          handlerRes.setHeader('Access-Control-Max-Age', maxAge);
          handlerRes.setBody(null);
        } else {
          handlerRes.setHeader('Access-Control-Allow-Credentials', 'true');
          handlerRes.setHeader('Access-Control-Allow-Origin', origin);
          const value = await handler(handlerReq, handlerRes);
          handlerRes.setBody(value ?? null);
        }
      } catch (e) {
        handlerRes.setStatus(500);
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
