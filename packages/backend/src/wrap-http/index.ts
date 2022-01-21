import {
  Server as HttpServer,
  type OutgoingHttpHeaders,
  type RequestListener,
  type ServerOptions as HttpServerOptions,
} from 'http';
import {
  Server as HttpSecureServer,
  type ServerOptions as HttpSecureServerOptions,
} from 'https';
import Cors from './cors';
import Request, { type HandlerRequest, type MultipartFile } from './request';
import Response, { type HandlerResponse, type JsonItem } from './response';
import Router from './router';
import { type Handler } from './type';

type ServerOptions<Secure extends boolean> = Secure extends false
  ? HttpServerOptions
  : HttpSecureServerOptions;

type ServerOriginalValue<Secure extends boolean> = Secure extends false
  ? HttpServer
  : HttpSecureServer;

interface CorsOptions {
  allowHeaders?: string;
  allowMethods?: string;
  allowOrigin?: (origin: string) => boolean;
  maxAge?: number;
}

const defaultHandler = () => {
  return { code: 404 };
};

class Server<Secure extends boolean = false, Version extends 1 = 1> {
  #cors: Cors;
  #router: Router;
  #originalValue: ServerOriginalValue<Secure>;

  constructor(
    options?: ServerOptions<Secure> & {
      secure?: Secure;
      version?: Version;
    },
  ) {
    const { secure, version, ...serverOptions } = options || {};
    this.#cors = new Cors();
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

  cors(options?: CorsOptions | boolean): void {
    if (options === undefined || options === true) {
      this.#cors.setEnable(true);
    } else if (options === false) {
      this.#cors.setEnable(false);
    } else {
      const { allowHeaders, allowMethods, allowOrigin, maxAge } = options;
      this.#cors.setEnable(true);
      this.#cors.setAllowOptions({
        ...(allowHeaders && { headers: allowHeaders }),
        ...(allowMethods && { methods: allowMethods }),
        ...(allowOrigin && { origin: allowOrigin }),
      });
      if (maxAge !== undefined) this.#cors.setMaxAge(maxAge);
    }
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
  ): void {
    this.#router.route(method, pathname, handler);
  }

  #getExtraHeaders(request: Request): OutgoingHttpHeaders {
    return {
      ...this.#cors.getExtraHeaders(
        request.getMethod(),
        request.getHeaders().origin,
      ),
      ...this.#router.getExtraHeaders(),
    };
  }

  #getHandler(request: Request): Handler {
    return (
      this.#cors.getHandler(request.getMethod(), request.getHeaders().origin) ||
      this.#router.getHandler(request.getMethod(), request.getUrl().pathname) ||
      defaultHandler
    );
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
  type Handler,
  type HandlerRequest,
  type HandlerResponse,
  type JsonItem,
  type MultipartFile,
};
