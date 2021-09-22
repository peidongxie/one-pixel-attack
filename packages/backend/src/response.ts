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

class HandlerRes {
  private isEnd: boolean;
  private statusCode: number;
  originalRes: ServerResponse;

  constructor(res: ServerResponse) {
    this.isEnd = false;
    this.statusCode = 0;
    this.originalRes = res;
  }

  setCode = (code: number): void => {
    this.statusCode = code;
    this.originalRes.statusCode = code;
  };

  setHeader = (
    name: string,
    value: string | number | readonly string[],
  ): void => {
    this.originalRes.setHeader(name, value);
  };

  setType = (type: string): void => {
    this.setHeader('Content-Type', type);
  };

  setLength = (length: number): void => {
    this.setHeader('Content-Length', length);
  };

  private setBodyNothing = (): void => {
    const res = this.originalRes;
    if (this.statusCode === 0) {
      this.setCode(204);
    }
    res.end();
  };

  private setBodyText = (value: string): void => {
    const res = this.originalRes;
    if (this.statusCode === 0) {
      this.setCode(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('text/plain; charset=utf-8');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(Buffer.byteLength(value));
    }
    res.end(value);
  };

  private setBodyError = (value: Error): void => {
    const res = this.originalRes;
    const str = value.message || 'Internal Server Error';
    if (this.statusCode === 0) {
      this.setCode(500);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('text/plain; charset=utf-8');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(Buffer.byteLength(str));
    }
    res.end(str);
  };

  private setBodyBuffer = (value: Buffer): void => {
    const res = this.originalRes;
    if (this.statusCode === 0) {
      this.setCode(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('application/octet-stream');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(value.length);
    }
    res.end(value);
  };

  private setBodyStream = (value: Stream): void => {
    const res = this.originalRes;
    if (this.statusCode === 0) {
      this.setCode(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('application/octet-stream');
    }
    value.pipe(res);
  };

  private setBodyJson = (value: StrictJsonItem): void => {
    const res = this.originalRes;
    const str = JSON.stringify(value);
    if (this.statusCode === 0) {
      this.setCode(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('application/json; charset=utf-8');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(Buffer.byteLength(str));
    }
    res.end(str);
  };

  setBody = (
    value?:
      | undefined
      | null
      | string
      | Error
      | Buffer
      | Stream
      | StrictJsonItem,
  ): void => {
    if (this.isEnd) return;
    if (value === undefined || value === null) {
      this.setBodyNothing();
    } else if (typeof value === 'string') {
      this.setBodyText(value);
    } else if (value instanceof Error) {
      this.setBodyError(value);
    } else if (Buffer.isBuffer(value)) {
      this.setBodyBuffer(value);
    } else if (value instanceof Stream) {
      this.setBodyStream(value);
    } else {
      this.setBodyJson(value);
    }
    this.isEnd = true;
  };
}

export default HandlerRes;
