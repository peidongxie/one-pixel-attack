import { Server as HttpServer } from 'http';
import type {
  IncomingMessage,
  IncomingHttpHeaders,
  ServerResponse,
} from 'http';
import { Server as HttpsServer } from 'https';
import { URL } from 'url';
import { receive } from './receive';
import { send, sendError } from './send';
import { TLSSocket } from 'tls';
import { Socket } from 'net';

export interface HandlerData<Body = unknown> {
  body: Body | void;
  headers: IncomingHttpHeaders;
  method: string;
  url: URL;
}

export interface HandlerMethod {
  send: (
    value?: Parameters<typeof send>[1],
    code?: Parameters<typeof send>[2],
    type?: Parameters<typeof send>[3],
    length?: Parameters<typeof send>[4],
  ) => void;
  setHeader: ServerResponse['setHeader'];
}

export interface HandlerCtx {
  req: IncomingMessage;
  res: ServerResponse;
}

export type HandlerValue = Parameters<typeof send>[1];

export type Handler = <Body = unknown>(
  data: HandlerData<Body>,
  method: HandlerMethod,
  ctx: HandlerCtx,
) => Promise<void | HandlerValue>;

export interface SendRecord {
  args: Parameters<HandlerMethod['send']>;
  value: boolean;
}

const getHeader = (headers: IncomingHttpHeaders, key: string): string => {
  const header = headers[key];
  if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
  if (typeof header === 'string') return header.split(/\s*,\s*/, 1)[0];
  return '';
};

const getProtocol = (req: IncomingMessage): string => {
  const {
    headers,
    socket: { encrypted },
  } = req as IncomingMessage & { socket: TLSSocket };
  return (
    (encrypted ? 'https' : '') ||
    getHeader(headers, 'x-forwarded-proto') ||
    'http'
  );
};

const getHost = (req: IncomingMessage): string => {
  const { headers, httpVersionMajor } = req;
  return (
    getHeader(headers, 'x-forwarded-host') ||
    (httpVersionMajor >= 2 ? getHeader(headers, ':authority') : '') ||
    getHeader(headers, 'host')
  );
};

const preHandle = async <Body = unknown>(
  req: IncomingMessage,
  res: ServerResponse,
  record: SendRecord,
): Promise<[HandlerData<Body>, HandlerMethod, HandlerCtx]> => {
  try {
    return [
      {
        body: await receive<Body>(req),
        headers: req.headers,
        method: req.method || '',
        url: new URL(req.url || '', `${getProtocol(req)}://${getHost(req)}`),
      },
      {
        send: (
          value?: Parameters<typeof send>[1],
          code?: Parameters<typeof send>[2],
          type?: Parameters<typeof send>[3],
          length?: Parameters<typeof send>[4],
        ) => {
          send(res, value, code, type, length);
          record.args = [value, code, type, length];
          record.value = true;
        },
        setHeader: res.setHeader.bind(res),
      },
      { req, res },
    ];
  } catch (e) {
    if (!record.value) {
      if (e instanceof Error) {
        sendError(res, e);
        record.args = [e];
        record.value = true;
      } else {
        const e = new Error('Bad Request');
        sendError(res, e, 400);
        record.args = [e, 400];
        record.value = true;
      }
    }
    throw e;
  }
};

const handle = async <Body = unknown>(
  args: [HandlerData<Body>, HandlerMethod, HandlerCtx],
  res: ServerResponse,
  record: SendRecord,
  handler: Handler,
): Promise<void | HandlerValue> => {
  try {
    const value = await handler(...args);
    return value;
  } catch (e) {
    if (!record.value) {
      if (e instanceof Error) {
        sendError(res, e);
        record.args = [e];
        record.value = true;
      } else {
        const e = new Error('Internal Server Error');
        sendError(res, e, 500);
        record.args = [e, 500];
        record.value = true;
      }
    }
    throw e;
  }
};

const postHandle = async (
  value: HandlerValue,
  res: ServerResponse,
  record: SendRecord,
): Promise<void> => {
  try {
    if (!record.value) {
      send(res, value);
      record.args = [value];
      record.value = true;
    }
  } catch (e) {
    if (!record.value) {
      if (e instanceof Error) {
        sendError(res, e);
        record.args = [e];
        record.value = true;
      } else {
        const e = new Error('Internal Server Error');
        sendError(res, e, 500);
        record.args = [e, 500];
        record.value = true;
      }
    }
    throw e;
  }
};

class Server {
  server: HttpServer | HttpsServer;

  constructor(handler: Handler) {
    const requestListener = async (
      req: IncomingMessage & { socket: Socket | TLSSocket },
      res: ServerResponse,
    ) => {
      const record: SendRecord = { args: [], value: false };
      try {
        const args = await preHandle(req, res, record);
        const value = await handle(args, res, record, handler);
        await postHandle(value ?? null, res, record);
      } catch (e) {
        console.error(e);
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
