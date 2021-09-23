import { json, text } from 'co-body';
import { IncomingForm } from 'formidable';
import type { IncomingMessage, IncomingHttpHeaders } from 'http';
import type { TLSSocket } from 'tls';
import typeis from 'type-is';

const form = new IncomingForm({ multiples: true });

const formTypes = ['multipart/form-data', 'application/x-www-form-urlencoded'];

const jsonTypes = [
  'application/json',
  'application/json-patch+json',
  'application/vnd.api+json',
  'application/csp-report',
];

const textTypes = ['text/plain'];

const xmlTypes = ['text/xml', 'application/xml'];

class HandlerReq<Body = unknown> {
  originalReq: IncomingMessage & { socket: TLSSocket };

  constructor(req: IncomingMessage) {
    this.originalReq = req as IncomingMessage & { socket: TLSSocket };
  }

  getBody = async (): Promise<Body | undefined> => {
    const req = this.originalReq;
    if (typeis(req, formTypes)) {
      return this.getBodyForm();
    } else if (typeis(req, jsonTypes)) {
      return this.getBodyJson();
    } else if (typeis(req, textTypes)) {
      return this.getBodyText();
    } else if (typeis(req, xmlTypes)) {
      return this.getBodyXml();
    }
  };

  getHeaders = (): IncomingHttpHeaders => {
    return this.originalReq.headers;
  };

  getMethod = (): string => {
    return this.originalReq.method || '';
  };

  getUrl = (): URL => {
    return new URL(
      this.originalReq.url || '',
      `${this.getProtocol()}://${this.getHost()}`,
    );
  };

  private async getBodyForm(): Promise<Body> {
    return new Promise((resolve, reject) => {
      form.parse(this.originalReq, (err, fields, files) => {
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

  private async getBodyJson(): Promise<Body> {
    return json(this.originalReq);
  }

  private async getBodyText(): Promise<Body> {
    return text(this.originalReq);
  }

  private async getBodyXml(): Promise<Body> {
    return text(this.originalReq);
  }

  private getHeader(key: string): string {
    const header = this.getHeaders()[key];
    if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
    if (typeof header === 'string') return header.split(/\s*,\s*/, 1)[0];
    return '';
  }

  private getHost(): string {
    const { httpVersionMajor } = this.originalReq;
    return (
      this.getHeader('x-forwarded-host') ||
      (httpVersionMajor >= 2 ? this.getHeader(':authority') : '') ||
      this.getHeader('host')
    );
  }

  private getProtocol(): string {
    const {
      socket: { encrypted },
    } = this.originalReq;
    return (
      (encrypted ? 'https' : '') ||
      this.getHeader('x-forwarded-proto') ||
      'http'
    );
  }
}

export default HandlerReq;
