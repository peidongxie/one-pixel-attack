import type { ServerResponse } from 'http';
import { Stream } from 'stream';

export type JsonItem =
  | null
  | boolean
  | number
  | string
  | { [key: string]: JsonItem }
  | JsonItem[];

export type StrictJsonItem = { [key: string]: JsonItem } | JsonItem[];

export const sendNothing = (res: ServerResponse, code?: number): void => {
  if (code || res.statusCode === 200) {
    res.statusCode = code || 204;
  }
  res.end();
};

export const sendText = (
  res: ServerResponse,
  value: string,
  code?: number,
  type?: string,
  length?: number,
): void => {
  const str = value;
  if (code || res.statusCode === 200) {
    res.statusCode = code || 200;
  }
  if (type || !res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', type || 'text/plain; charset=utf-8');
  }
  if (length || !res.getHeader('Content-Length')) {
    res.setHeader('Content-Length', length || Buffer.byteLength(str));
  }
  res.end(str);
};

export const sendError = (
  res: ServerResponse,
  value: Error,
  code?: number,
  type?: string,
  length?: number,
): void => {
  const str = value.message || 'Internal Server Error';
  if (code || res.statusCode === 200) {
    res.statusCode = code || 500;
  }
  if (type || !res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', type || 'text/plain; charset=utf-8');
  }
  if (length || !res.getHeader('Content-Length')) {
    res.setHeader('Content-Length', length || Buffer.byteLength(str));
  }
  res.end(str);
};

export const sendBuffer = (
  res: ServerResponse,
  value: Buffer,
  code?: number,
  type?: string,
  length?: number,
): void => {
  if (code || res.statusCode === 200) {
    res.statusCode = code || 200;
  }
  if (type || !res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', type || 'application/octet-stream');
  }
  if (length || !res.getHeader('Content-Length')) {
    res.setHeader('Content-Length', length || value.length);
  }
  res.end(value);
};

export const sendStream = (
  res: ServerResponse,
  value: Stream,
  code?: number,
  type?: string,
): void => {
  if (code || res.statusCode === 200) {
    res.statusCode = code || 200;
  }
  if (type || !res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', type || 'application/octet-stream');
  }
  value.pipe(res);
};

export const sendJson = (
  res: ServerResponse,
  value: StrictJsonItem,
  code?: number,
  type?: string,
  length?: number,
): void => {
  const str = JSON.stringify(value);
  if (code || res.statusCode === 200) {
    res.statusCode = code || 200;
  }
  if (type || !res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', type || 'application/json; charset=utf-8');
  }
  if (length || !res.getHeader('Content-Length')) {
    res.setHeader('Content-Length', length || Buffer.byteLength(str));
  }
  res.end(str);
};

export const send = (
  res: ServerResponse,
  value?: null | string | Error | Buffer | Stream | StrictJsonItem,
  code?: number,
  type?: string,
  length?: number,
): void => {
  if (value === undefined || value === null) {
    sendNothing(res, code);
  } else if (typeof value === 'string') {
    sendText(res, value, code, type, length);
  } else if (value instanceof Error) {
    sendError(res, value, code, type, length);
  } else if (Buffer.isBuffer(value)) {
    sendBuffer(res, value, code, type, length);
  } else if (value instanceof Stream) {
    sendStream(res, value, code, type);
  } else {
    sendJson(res, value, code, type, length);
  }
};
