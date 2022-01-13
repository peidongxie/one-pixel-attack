import { json, text } from 'co-body';
import formidable from 'formidable';
import { type IncomingMessage, type IncomingHttpHeaders } from 'http';
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

interface MultipartFile {
  name: string | null;
  path: string;
  size: number;
  type: string | null;
}

interface HandlerRequest {
  getMethod: Request['getMethod'];
  getUrl: Request['getUrl'];
  getHeaders: Request['getHeaders'];
  getBody: Request['getBody'];
}

class Request {
  #originalValue: IncomingMessage;

  constructor(req: IncomingMessage) {
    this.#originalValue = req;
  }

  async getBody<Body>(): Promise<Body | undefined> {
    const req = this.#originalValue;
    if (typeis(req, formTypes)) {
      return this.#getBodyForm<Body>();
    } else if (typeis(req, jsonTypes)) {
      return this.#getBodyJson<Body>();
    } else if (typeis(req, textTypes)) {
      return this.#getBodyText<Body>();
    } else if (typeis(req, xmlTypes)) {
      return this.#getBodyXml<Body>();
    }
  }

  getHeaders(): IncomingHttpHeaders {
    return this.#originalValue.headers;
  }

  getMethod(): string {
    return this.#originalValue.method || '';
  }

  getUrl(): URL {
    return new URL(
      this.#originalValue.url || '',
      `${this.#getProtocol()}://${this.#getHost()}`,
    );
  }

  getRequest(): HandlerRequest {
    return {
      getMethod: this.getMethod.bind(this),
      getUrl: this.getUrl.bind(this),
      getHeaders: this.getHeaders.bind(this),
      getBody: this.getBody.bind(this),
    };
  }

  async #getBodyForm<Body>(): Promise<Body> {
    return new Promise((resolve, reject) => {
      form.parse(this.#originalValue, (err, fields, files) => {
        if (err) {
          const reason = err;
          reject(reason);
        } else {
          const newFiles: Record<string, MultipartFile | MultipartFile[]> = {};
          for (const key in files) {
            const value = files[key];
            if (!Array.isArray(value)) {
              newFiles[key] = {
                name: value.originalFilename,
                path: value.filepath,
                size: value.size,
                type: value.mimetype,
              };
            } else {
              newFiles[key] = value.map((value) => ({
                name: value.originalFilename,
                path: value.filepath,
                size: value.size,
                type: value.mimetype,
              }));
            }
          }
          const value: unknown = { ...fields, ...newFiles };
          resolve(value as Body);
        }
      });
    });
  }

  async #getBodyJson<Body>(): Promise<Body> {
    return json(this.#originalValue);
  }

  async #getBodyText<Body>(): Promise<Body> {
    return text(this.#originalValue);
  }

  async #getBodyXml<Body>(): Promise<Body> {
    return text(this.#originalValue);
  }

  #getHeaderContent(key: string): string {
    const header = this.getHeaders()[key];
    if (Array.isArray(header)) return header[0].split(/\s*,\s*/, 1)[0];
    if (header) return header.split(/\s*,\s*/, 1)[0];
    return '';
  }

  #getHost(): string {
    const http2 = this.#originalValue.httpVersionMajor >= 2;
    return (
      this.#getHeaderContent('x-forwarded-host') ||
      (http2 ? this.#getHeaderContent(':authority') : '') ||
      this.#getHeaderContent('host') ||
      'unknown'
    );
  }

  #getProtocol(): string {
    const encrypted = Reflect.has(this.#originalValue.socket, 'encrypted');
    return (
      (encrypted ? 'https' : '') ||
      this.#getHeaderContent('x-forwarded-proto') ||
      'http'
    );
  }
}

export { Request as default, type HandlerRequest, type MultipartFile };
