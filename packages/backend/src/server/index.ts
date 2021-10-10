import { Server as HttpServer } from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';
import Request from './request';
import type { HandlerRequest } from './request';
import Response from './response';
import type { HandlerResponse } from './response';

export type Handler = (
  req: HandlerRequest,
) => void | HandlerResponse | Promise<void | HandlerResponse>;

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
      const request = new Request(req);
      const response = new Response(res);
      const origin = request.getHeaders().origin || '';
      try {
        if (!allowOrigin(origin)) {
          response.setResponse({
            code: 400,
            headers: {
              Vary: 'Origin',
            },
          });
        } else if (request.getMethod() === 'OPTIONS') {
          response.setResponse({
            headers: {
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Headers': allowHeaders,
              'Access-Control-Allow-Methods': allowMethods,
              'Access-Control-Allow-Origin': origin,
              'Access-Control-Max-Age': maxAge,
              Vary: 'Origin',
            },
          });
        } else {
          const handlerRequest = request.getRequest();
          const handlerResponse = (await handler(handlerRequest)) ?? {};
          response.setResponse({
            ...handlerResponse,
            headers: {
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': origin,
              Vary: 'Origin',
              ...handlerResponse.headers,
            },
          });
        }
      } catch (e) {
        response.setCode(500);
        if (e instanceof Error) response.setBody(e);
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
