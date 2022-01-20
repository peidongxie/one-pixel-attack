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
import Router from './router';

interface CorsOptions {
  allowHeaders?: string;
  allowMethods?: string;
  allowOrigin?: (origin: string) => boolean;
  enable?: boolean;
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
  #router: Router;
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
      enable: false,
      maxAge: 600,
    };
    this.#router = new Router();
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
    return async (req, res) => {
      const request = new Request(req);
      const response = new Response(res);
      const extraHeaders = this.#getExtraHeaders(request);
      const handler = this.#getHandler(request);
      try {
        const handlerRequest = request.getRequest();
        const handlerResponse = (await handler(handlerRequest)) ?? {};
        response.setResponse({
          ...handlerResponse,
          headers: {
            ...extraHeaders,
            ...handlerResponse.headers,
          },
        });
      } catch (e) {
        if (e instanceof Error) {
          response.setResponse({ headers: extraHeaders, body: e });
        } else {
          response.setResponse({ code: 500, headers: extraHeaders });
        }
      }
    };
  }

  cors(options?: CorsOptions): Required<CorsOptions> {
    return (this.#cors = {
      ...this.#cors,
      ...options,
      enable: options?.enable ?? true,
    });
  }

  listen(port?: number): ServerOriginalValue<Secure> {
    this.#originalValue.on('request', this.callback());
    const secure = this.#originalValue instanceof HttpSecureServer;
    this.#originalValue.listen(port || (secure ? 443 : 80));
    return this.#originalValue;
  }

  route(
    method: string | string[],
    pathname: string | RegExp,
    handler?: Handler,
  ) {
    this.#router.route(method, pathname, handler);
  }

  #getAllowed(origin?: string) {
    if (!this.#cors.enable) return true;
    if (origin === undefined) return true;
    return this.#cors.allowOrigin(origin);
  }

  #getExtraHeaders(request: Request) {
    return this.#getHeaders(request.getMethod(), request.getHeaders().origin);
  }

  #getForbiddenHandler(): Handler {
    return () => ({ code: 400 });
  }

  #getHandler(request: Request): Handler {
    if (!this.#getAllowed(request.getHeaders().origin)) {
      return this.#getForbiddenHandler();
    }
    return this.#router.getHandler(
      request.getMethod(),
      request.getUrl().pathname,
    );
  }

  #getHeaders(method: string, origin?: string) {
    const { allowHeaders, allowMethods, maxAge } = this.#cors;
    if (this.#getAllowed(origin)) return {};
    return method === 'OPTIONS'
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
