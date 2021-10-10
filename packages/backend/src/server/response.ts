import type { OutgoingHttpHeaders, ServerResponse } from 'http';
import { Stream } from 'stream';

export type JsonItem =
  | null
  | boolean
  | number
  | string
  | { [key: string]: JsonItem }
  | JsonItem[];

export type StrictJsonItem = { [key: string]: JsonItem } | JsonItem[];

export interface HandlerResponse {
  code?: Parameters<Response['setCode']>[0];
  message?: Parameters<Response['setMessage']>[0];
  headers?: Parameters<Response['setHeaders']>[0];
  body?: Parameters<Response['setBody']>[0];
}

class Response {
  originalValue: ServerResponse;

  constructor(res: ServerResponse) {
    this.originalValue = res;
  }

  setBody = (
    value: null | string | Error | Buffer | Stream | StrictJsonItem,
  ): void => {
    if (this.originalValue.writableEnded) return;
    if (value === null) {
      this.#setBodyNothing();
    } else if (typeof value === 'string') {
      this.#setBodyText(value);
    } else if (value instanceof Error) {
      this.#setBodyError(value);
    } else if (Buffer.isBuffer(value)) {
      this.#setBodyBuffer(value);
    } else if (value instanceof Stream) {
      this.#setBodyStream(value);
    } else {
      this.#setBodyJson(value);
    }
  };

  setCode = (code: number): void => {
    this.originalValue.statusCode = code;
  };

  setHeaders = (headers: OutgoingHttpHeaders): void => {
    for (const key in headers) {
      const value = headers[key];
      if (value !== undefined) this.#setHeader(key, value);
    }
  };

  setMessage = (message: string): void => {
    this.originalValue.statusMessage = message;
  };

  setResponse(res: HandlerResponse): void {
    const { body, code, headers, message } = res;
    if (body !== undefined) this.setBody(body);
    if (code !== undefined) this.setCode(code);
    if (headers !== undefined) this.setHeaders(headers);
    if (message !== undefined) this.setMessage(message);
  }

  #setBodyBuffer(value: Buffer): void {
    const res = this.originalValue;
    this.setCode(200);
    this.#setHeader('Content-Type', 'application/octet-stream');
    this.#setHeader('Content-Length', value.length);
    res.end(value);
  }

  #setBodyError(value: Error): void {
    const res = this.originalValue;
    const str = value.message || 'Internal Server Error';
    this.setCode(500);
    this.#setHeader('Content-Type', 'text/plain; charset=utf-8');
    this.#setHeader('Content-Length', Buffer.byteLength(str));
    res.end(str);
  }

  #setBodyJson = (value: StrictJsonItem): void => {
    const res = this.originalValue;
    const str = JSON.stringify(value);
    this.setCode(200);
    this.#setHeader('Content-Type', 'application/json; charset=utf-8');
    this.#setHeader('Content-Length', Buffer.byteLength(str));
    res.end(str);
  };

  #setBodyNothing(): void {
    const res = this.originalValue;
    this.setCode(204);
    res.end();
  }

  #setBodyStream(value: Stream): void {
    const res = this.originalValue;
    this.setCode(200);
    this.#setHeader('Content-Type', 'application/octet-stream');
    value.pipe(res);
  }

  #setBodyText(value: string): void {
    const res = this.originalValue;
    this.setCode(200);
    this.#setHeader('Content-Type', 'text/plain; charset=utf-8');
    this.#setHeader('Content-Length', Buffer.byteLength(value));
    res.end(value);
  }

  #setHeader = (
    name: string,
    value: string | number | readonly string[],
  ): void => {
    this.originalValue.setHeader(name, value);
  };
}

export default Response;
