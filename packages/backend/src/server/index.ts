import { Server as HttpServer, RequestListener } from 'http';
import { Server as HttpsServer } from 'https';
import Request, { type HandlerRequest, type MultipartFile } from './request';
import Response, { type HandlerResponse, type JsonItem } from './response';

interface CorsOptions {
  allowHeaders?: string;
  allowMethods?: string;
  allowOrigin?: (origin: string) => boolean;
  maxAge?: number;
}

type Handler = (
  req: HandlerRequest,
) => void | HandlerResponse | Promise<void | HandlerResponse>;

class Server {
  #originalValue: HttpServer | HttpsServer;

  constructor(handler: Handler, corsOptions?: CorsOptions) {
    const { allowHeaders, allowMethods, allowOrigin, maxAge } = {
      allowHeaders: '*',
      allowMethods: '*',
      allowOrigin: () => true,
      maxAge: 600,
      ...corsOptions,
    };
    const requestListener: RequestListener = async (req, res) => {
      const request = new Request(req);
      const response = new Response(res);
      const origin = request.getHeaders().origin;
      const corsForbidden = origin !== undefined && !allowOrigin(origin);
      const corsHeaders = corsForbidden
        ? {}
        : request.getMethod() === 'OPTIONS'
        ? {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': allowHeaders,
            'Access-Control-Allow-Methods': allowMethods,
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Max-Age': maxAge,
          }
        : {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': origin,
          };
      try {
        if (corsForbidden) {
          response.setResponse({
            code: 400,
          });
        } else {
          const handlerRequest = request.getRequest();
          const handlerResponse = (await handler(handlerRequest)) ?? {};
          response.setResponse({
            ...handlerResponse,
            headers: {
              ...corsHeaders,
              ...handlerResponse.headers,
            },
          });
        }
      } catch (e) {
        if (e instanceof Error) {
          response.setResponse({ headers: corsHeaders, body: e });
        } else {
          response.setResponse({ code: 500, headers: corsHeaders });
        }
      }
    };
    const server = new HttpServer(requestListener);
    this.#originalValue = server;
  }

  start(port?: number): void {
    this.#originalValue.listen(
      port || (this.#originalValue instanceof HttpsServer ? 443 : 80),
    );
  }
}

export {
  Server as default,
  type CorsOptions,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type JsonItem,
  type MultipartFile,
};
