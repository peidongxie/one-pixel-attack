import {
  Server as HttpServer,
  type RequestListener,
  type ServerOptions as HttpServerOptions,
} from 'http';
import {
  Server as HttpSecureServer,
  type ServerOptions as HttpSecureServerOptions,
} from 'https';
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

type ServerOptions<Secure extends boolean> = Secure extends false
  ? HttpServerOptions
  : HttpSecureServerOptions;

type ServerOriginalValue<Secure extends boolean> = Secure extends false
  ? HttpServer
  : HttpSecureServer;

class Server<Secure extends boolean = false, Version extends 1 = 1> {
  #cors: Required<CorsOptions>;
  #handler: Handler;
  #originalValue: ServerOriginalValue<Secure>;

  constructor(
    options?: ServerOptions<Secure> & {
      secure?: Secure;
      version?: Version;
    },
  ) {
    const { secure, version, ...serverOptions } = options || {};
    this.#cors = {
      allowHeaders: '*',
      allowMethods: '*',
      allowOrigin: () => true,
      maxAge: 600,
    };
    this.#handler = () => {
      return;
    };
    switch (version) {
      case 1:
        this.#originalValue = (
          !secure
            ? new HttpServer(serverOptions)
            : new HttpSecureServer(serverOptions)
        ) as ServerOriginalValue<Secure>;
        break;
      default:
        this.#originalValue = (
          !secure
            ? new HttpServer(serverOptions)
            : new HttpSecureServer(serverOptions)
        ) as ServerOriginalValue<Secure>;
        break;
    }
  }

  callback(): RequestListener {
    const { allowHeaders, allowMethods, allowOrigin, maxAge } = this.#cors;
    const handler = this.#handler;
    return async (req, res) => {
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
  }

  cors(options?: CorsOptions): Required<CorsOptions> {
    return (this.#cors = {
      ...this.#cors,
      ...options,
    });
  }

  listen(port?: number): ServerOriginalValue<Secure> {
    this.#originalValue.on('request', this.callback());
    const secure = this.#originalValue instanceof HttpServer;
    this.#originalValue.listen(port || (secure ? 80 : 443));
    return this.#originalValue;
  }

  use(handler: Handler) {
    return (this.#handler = handler);
  }
}

const createServer = <Secure extends boolean, Version extends 1>(
  options?: ServerOptions<Secure> & {
    secure?: Secure;
    version?: Version;
  },
): Server<Secure, Version> => {
  return new Server(options);
};

export {
  Server,
  createServer,
  type CorsOptions,
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type JsonItem,
  type MultipartFile,
};
