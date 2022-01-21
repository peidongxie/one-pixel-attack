import { Stream } from 'stream';
import { type HandlerResponse } from './handler';
import { type ServerResponse, type ServerResponseHeaders } from './server';

type JsonItem = object;

class Response<Version extends 1 | 2 = 1> {
  #originalValue: ServerResponse<Version>;

  constructor(res: ServerResponse<Version>) {
    this.#originalValue = res;
  }

  setBody(value: null | string | Error | Buffer | Stream | JsonItem): void {
    if (this.#originalValue.writableEnded) return;
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
  }

  setCode(code: number): void {
    this.#originalValue.statusCode = code;
  }

  setHeaders(headers: ServerResponseHeaders): void {
    for (const key in headers) {
      const value = headers[key];
      if (value !== undefined) this.#setHeader(key, value);
    }
  }

  setMessage(message: string): void {
    this.#originalValue.statusMessage = message;
  }

  setResponse(res: HandlerResponse): void {
    const { body, code, headers, message } = res;
    if (code !== undefined) this.setCode(code);
    if (message !== undefined) this.setMessage(message);
    if (headers !== undefined) this.setHeaders(headers);
    if (body !== undefined) this.setBody(body);
    else this.setBody(null);
  }

  #setBodyBuffer(value: Buffer): void {
    const res = this.#originalValue;
    if (!this.#originalValue.hasHeader('Content-Type')) {
      this.#setHeader('Content-Type', 'application/octet-stream');
    }
    this.#setHeader('Content-Length', value.length);
    res.end(value);
  }

  #setBodyError(value: Error): void {
    const res = this.#originalValue;
    const str = value.message || 'Internal Server Error';
    if (this.#originalValue.statusCode === 200) this.setCode(500);
    if (!this.#originalValue.hasHeader('Content-Type')) {
      this.#setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    this.#setHeader('Content-Length', Buffer.byteLength(str));
    res.end(str);
  }

  #setBodyJson = (value: JsonItem): void => {
    const res = this.#originalValue;
    const str = JSON.stringify(value, (key, value) => {
      return typeof value === 'bigint' ? value.toString() + 'n' : value;
    });
    if (!this.#originalValue.hasHeader('Content-Type')) {
      this.#setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    this.#setHeader('Content-Length', Buffer.byteLength(str));
    res.end(str);
  };

  #setBodyNothing(): void {
    const res = this.#originalValue;
    if (this.#originalValue.statusCode === 200) {
      this.setCode(204);
    }
    res.end();
  }

  #setBodyStream(value: Stream): void {
    const res = this.#originalValue;
    if (!this.#originalValue.hasHeader('Content-Type')) {
      this.#setHeader('Content-Type', 'application/octet-stream');
    }
    value.pipe(res);
  }

  #setBodyText(value: string): void {
    const res = this.#originalValue;
    if (!this.#originalValue.hasHeader('Content-Type')) {
      this.#setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    this.#setHeader('Content-Length', Buffer.byteLength(value));
    res.end(value);
  }

  #setHeader = (
    name: string,
    value: string | number | readonly string[],
  ): void => {
    this.#originalValue.setHeader(name, value);
  };
}

export { Response as default, type JsonItem };
