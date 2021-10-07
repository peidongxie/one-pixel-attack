import { json, text } from 'co-body';
import formidable from 'formidable';
import type { IncomingMessage, IncomingHttpHeaders } from 'http';
import type { TLSSocket } from 'tls';
import typeis from 'type-is';

const form = formidable({ multiples: true });

const formTypes = ['multipart/form-data', 'application/x-www-form-urlencoded'];

const jsonTypes = [
  'application/json',
  'application/json-patch+json',
  'application/vnd.api+json',
  'application/csp-report',
];

const textTypes = ['text/plain'];

const xmlTypes = ['text/xml', 'application/xml'];

class HandlerReq {
  originalValue: IncomingMessage & { socket: TLSSocket };

  constructor(req: IncomingMessage) {
    this.originalValue = req as IncomingMessage & { socket: TLSSocket };
  }

  getBody = async <Body>(): Promise<Body | undefined> => {
    const req = this.originalValue;
    if (typeis(req, formTypes)) {
      return this.getBodyForm<Body>();
    } else if (typeis(req, jsonTypes)) {
      return this.getBodyJson<Body>();
    } else if (typeis(req, textTypes)) {
      return this.getBodyText<Body>();
    } else if (typeis(req, xmlTypes)) {
      return this.getBodyXml<Body>();
    }
  };

  getHeaders = (): IncomingHttpHeaders => {
    return this.originalValue.headers;
  };

  getMethod = (): string => {
    return this.originalValue.method || '';
  };

  getUrl = (): URL => {
    return new URL(
      this.originalValue.url || '',
      `${this.getProtocol()}://${this.getHost()}`,
    );
  };

  private async getBodyForm<Body>(): Promise<Body> {
    return new Promise((resolve, reject) => {
      form.parse(this.originalValue, (err, fields, files) => {
        if (err) {
          const reason: unknown = err;
          reject(reason);
        } else {
          const value: unknown = { ...fields, ...files };
          resolve(value as Body);
        }
      });
    });
  }

  private async getBodyJson<Body>(): Promise<Body> {
    return json(this.originalValue);
  }

  private async getBodyText<Body>(): Promise<Body> {
    return text(this.originalValue);
  }

  private async getBodyXml<Body>(): Promise<Body> {
    return text(this.originalValue);
  }

  private getHeaderContent(key: string): string {
    const header = this.getHeaders()[key];
    if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
    if (header) return header.split(/\s*,\s*/, 1)[0];
    return '';
  }

  private getHost(): string {
    const { httpVersionMajor } = this.originalValue;
    return (
      this.getHeaderContent('x-forwarded-host') ||
      (httpVersionMajor >= 2 ? this.getHeaderContent(':authority') : '') ||
      this.getHeaderContent('host') ||
      'localhost'
    );
  }

  private getProtocol(): string {
    const {
      socket: { encrypted },
    } = this.originalValue;
    return (
      (encrypted ? 'https' : '') ||
      this.getHeaderContent('x-forwarded-proto') ||
      'http'
    );
  }
}

export default HandlerReq;
