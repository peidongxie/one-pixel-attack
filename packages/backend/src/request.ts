import { form, json, text } from 'co-body';
import type { IncomingMessage, IncomingHttpHeaders } from 'http';
import type { TLSSocket } from 'tls';
import typeis from 'type-is';

class HandlerReq<Body = unknown> {
  private jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
  ];
  private formTypes = ['application/x-www-form-urlencoded'];
  private textTypes = ['text/plain'];
  private xmlTypes = ['text/xml', 'application/xml'];
  originalReq: IncomingMessage & { socket: TLSSocket };

  constructor(req: IncomingMessage) {
    this.originalReq = req as IncomingMessage & { socket: TLSSocket };
  }

  getMethod = (): string => {
    return this.originalReq.method || '';
  };

  getHeaders = (): IncomingHttpHeaders => {
    return this.originalReq.headers;
  };

  private getHeader = (key: string): string => {
    const header = this.getHeaders()[key];
    if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
    if (typeof header === 'string') return header.split(/\s*,\s*/, 1)[0];
    return '';
  };

  private getHost = (): string => {
    const { httpVersionMajor } = this.originalReq;
    return (
      this.getHeader('x-forwarded-host') ||
      (httpVersionMajor >= 2 ? this.getHeader(':authority') : '') ||
      this.getHeader('host')
    );
  };

  private getProtocol = (): string => {
    const {
      socket: { encrypted },
    } = this.originalReq;
    return (
      (encrypted ? 'https' : '') ||
      this.getHeader('x-forwarded-proto') ||
      'http'
    );
  };

  getUrl = (): URL => {
    return new URL(
      this.originalReq.url || '',
      `${this.getProtocol()}://${this.getHost()}`,
    );
  };

  private getBodyJson = async (): Promise<Body> => {
    return json(this.originalReq);
  };

  private getBodyForm = async (): Promise<Body> => {
    return form(this.originalReq);
  };

  private getBodyText = async (): Promise<Body> => {
    return text(this.originalReq);
  };

  private getBodyXml = async (): Promise<Body> => {
    return text(this.originalReq);
  };

  getBody = async (): Promise<Body | undefined> => {
    const req = this.originalReq;
    if (typeis(req, this.jsonTypes)) {
      return this.getBodyJson();
    } else if (typeis(req, this.formTypes)) {
      return this.getBodyForm();
    } else if (typeis(req, this.textTypes)) {
      return this.getBodyText();
    } else if (typeis(req, this.xmlTypes)) {
      return this.getBodyXml();
    }
  };
}

export default HandlerReq;
