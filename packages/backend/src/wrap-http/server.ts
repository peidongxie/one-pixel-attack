import {
  createServer as createHttpServer,
  type IncomingHttpHeaders as HttpServerRequestHeaders,
  type IncomingMessage as HttpServerRequest,
  type OutgoingHttpHeaders,
  type ServerResponse as HttpServerResponse,
  type ServerOptions as HttpServerOptions,
} from 'http';
import {
  createSecureServer as createHttp2SecureServer,
  createServer as createHttp2Server,
  type Http2ServerRequest,
  type Http2ServerResponse,
  type IncomingHttpHeaders as Http2ServerRequestHeaders,
  type SecureServerOptions as Http2SecureServerOptions,
  type ServerOptions as Http2ServerOptions,
} from 'http2';
import {
  createServer as createHttpSecureServer,
  type ServerOptions as HttpSecureServerOptions,
} from 'https';
import Cors from './cors';
import defaultHandler, { type Handler } from './handler';
import Request from './request';
import Response from './response';
import Router from './router';

type ServerOptions<
  Secure extends boolean,
  Version extends 1 | 2,
> = Version extends 1
  ? Secure extends false
    ? HttpServerOptions
    : HttpSecureServerOptions
  : Version extends 2
  ? Secure extends false
    ? Http2ServerOptions
    : Http2SecureServerOptions
  : never;

type ServerOriginalValue<
  Secure extends boolean,
  Version extends 1 | 2,
> = Version extends 1
  ? Secure extends false
    ? ReturnType<typeof createHttpServer>
    : ReturnType<typeof createHttpSecureServer>
  : Version extends 2
  ? Secure extends false
    ? ReturnType<typeof createHttp2Server>
    : ReturnType<typeof createHttp2SecureServer>
  : never;

type ServerRequest<Version extends 1 | 2> = Version extends 1
  ? HttpServerRequest
  : Version extends 2
  ? Http2ServerRequest
  : never;

type ServerRequestHeaders<Version extends 1 | 2> = Version extends 1
  ? HttpServerRequestHeaders
  : Version extends 2
  ? Http2ServerRequestHeaders
  : never;

type ServerResponse<Version extends 1 | 2> = Version extends 1
  ? HttpServerResponse
  : Version extends 2
  ? Http2ServerResponse
  : never;

type ServerResponseHeaders = OutgoingHttpHeaders;

type ServerListener<Version extends 1 | 2> = (
  req: ServerRequest<Version>,
  res: ServerResponse<Version>,
) => void;

interface CorsOptions {
  allowHeaders?: string;
  allowMethods?: string;
  allowOrigin?: (origin: string) => boolean;
  maxAge?: number;
}

class Server<Secure extends boolean = false, Version extends 1 | 2 = 1> {
  #cors: Cors;
  #router: Router;
  #secure: boolean;
  #originalValue: ServerOriginalValue<Secure, Version>;

  constructor(
    options?: ServerOptions<Secure, Version> & {
      secure?: Secure;
      version?: Version;
    },
  ) {
    const { secure, version, ...serverOptions } = options || {};
    this.#cors = new Cors();
    this.#router = new Router();
    this.#secure = secure ?? false;
    switch (version) {
      case 1:
        this.#originalValue = (
          !secure
            ? createHttpServer(serverOptions)
            : createHttpSecureServer(serverOptions)
        ) as ServerOriginalValue<Secure, Version>;
        break;
      case 2:
        this.#originalValue = (
          !secure
            ? createHttp2Server(serverOptions)
            : createHttp2SecureServer(serverOptions)
        ) as ServerOriginalValue<Secure, Version>;
        break;
      default:
        this.#originalValue = (
          !secure
            ? createHttpServer(serverOptions)
            : createHttpSecureServer(serverOptions)
        ) as ServerOriginalValue<Secure, Version>;
        break;
    }
  }

  callback(): ServerListener<Version> {
    return async (req, res) => {
      const request = new Request<Version>(req);
      const response = new Response<Version>(res);
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

  listen(port?: number): ServerOriginalValue<Secure, Version> {
    this.#originalValue.on('request', this.callback());
    this.#originalValue.listen(port || (this.#secure ? 443 : 80));
    return this.#originalValue;
  }

  route(
    method: string | string[],
    pathname: string | RegExp,
    handler?: Handler,
  ): void {
    this.#router.route(method, pathname, handler);
  }

  #getExtraHeaders(request: Request<Version>): ServerResponseHeaders {
    return {
      ...this.#cors.getExtraHeaders(
        request.getMethod(),
        request.getHeaders().origin,
      ),
      ...this.#router.getExtraHeaders(),
    };
  }

  #getHandler(request: Request<Version>): Handler {
    return (
      this.#cors.getHandler(request.getMethod(), request.getHeaders().origin) ||
      this.#router.getHandler(request.getMethod(), request.getUrl().pathname) ||
      defaultHandler
    );
  }
}

export {
  Server as default,
  type ServerListener,
  type ServerOptions,
  type ServerRequest,
  type ServerRequestHeaders,
  type ServerResponse,
  type ServerResponseHeaders,
};
