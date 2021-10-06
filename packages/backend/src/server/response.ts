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
    this.isEnd = false;
    this.statusCode = 0;
    this.originalValue = res;
  }

  // todo: version status(code/code+message) headers body

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

  setHeader = (
    name: string,
    value: string | number | readonly string[],
  ): void => {
    this.originalValue.setHeader(name, value);
  };

  setStatus = (code: number): void => {
    this.statusCode = code;
    this.originalValue.statusCode = code;
    this.originalValue.statusMessage = '';
  };

  setType = (type: string): void => {
    this.setHeader('Content-Type', type);
  };

  private isEnd: boolean;

  private statusCode: number;

  private setBodyBuffer(value: Buffer): void {
    const res = this.originalValue;
    if (this.statusCode === 0) {
      this.setStatus(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('application/octet-stream');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(value.length);
    }
    res.end(value);
  }

  private setBodyError(value: Error): void {
    const res = this.originalValue;
    const str = value.message || 'Internal Server Error';
    if (this.statusCode === 0) {
      this.setStatus(500);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('text/plain; charset=utf-8');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(Buffer.byteLength(str));
    }
    res.end(str);
  }

  private setBodyJson = (value: StrictJsonItem): void => {
    const res = this.originalValue;
    const str = JSON.stringify(value);
    if (this.statusCode === 0) {
      this.setStatus(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('application/json; charset=utf-8');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(Buffer.byteLength(str));
    }
    res.end(str);
  };

  private setBodyNothing(): void {
    const res = this.originalValue;
    if (this.statusCode === 0) {
      this.setStatus(204);
    }
    res.end();
  }

  private setBodyStream(value: Stream): void {
    const res = this.originalValue;
    if (this.statusCode === 0) {
      this.setStatus(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('application/octet-stream');
    }
    value.pipe(res);
  }

  private setBodyText(value: string): void {
    const res = this.originalValue;
    if (this.statusCode === 0) {
      this.setStatus(200);
    }
    if (!res.getHeader('Content-Type')) {
      this.setType('text/plain; charset=utf-8');
    }
    if (!res.getHeader('Content-Length')) {
      this.setLength(Buffer.byteLength(value));
    }
    res.end(value);
  }

  private setLength(length: number): void {
    this.setHeader('Content-Length', length);
  }
}

export default HandlerRes;
