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
  originalValue: ServerResponse;

  constructor(res: ServerResponse) {
    this.originalValue = res;
  }

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
    if (this.getEnded()) return;
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
  };

  setCode = (code: number): void => {
    this.originalValue.statusCode = code;
  };

  // todo: setHeaders

  setMessage = (message: string): void => {
    this.originalValue.statusMessage = message;
  };

  private getEnded(): boolean {
    return this.originalValue.writableEnded;
  }

  private setBodyBuffer(value: Buffer): void {
    const res = this.originalValue;
    this.setCode(200);
    this.setHeader('Content-Type', 'application/octet-stream');
    this.setHeader('Content-Length', value.length);
    res.end(value);
  }

  private setBodyError(value: Error): void {
    const res = this.originalValue;
    const str = value.message || 'Internal Server Error';
    this.setCode(500);
    this.setHeader('Content-Type', 'text/plain; charset=utf-8');
    this.setHeader('Content-Length', Buffer.byteLength(str));
    res.end(str);
  }

  private setBodyJson = (value: StrictJsonItem): void => {
    const res = this.originalValue;
    const str = JSON.stringify(value);
    this.setCode(200);
    this.setHeader('Content-Type', 'application/json; charset=utf-8');
    this.setHeader('Content-Length', Buffer.byteLength(str));
    res.end(str);
  };

  private setBodyNothing(): void {
    const res = this.originalValue;
    this.setCode(204);
    res.end();
  }

  private setBodyStream(value: Stream): void {
    const res = this.originalValue;
    this.setCode(200);
    this.setHeader('Content-Type', 'application/octet-stream');
    value.pipe(res);
  }

  private setBodyText(value: string): void {
    const res = this.originalValue;
    this.setCode(200);
    this.setHeader('Content-Type', 'text/plain; charset=utf-8');
    this.setHeader('Content-Length', Buffer.byteLength(value));
    res.end(value);
  }

  // todo: private
  setHeader = (
    name: string,
    value: string | number | readonly string[],
  ): void => {
    this.originalValue.setHeader(name, value);
  };
}

export default HandlerRes;
