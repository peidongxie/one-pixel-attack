import { type OutgoingHttpHeaders } from 'http';
import { type Handler } from './handler';

interface AllowOptions {
  headers?: string;
  methods?: string;
  origin?: (origin: string) => boolean;
}

const forbiddenHandler = () => {
  return { code: 400 };
};

const preflightHandler = () => {
  return { code: 204 };
};

class Cors {
  #allowOptions: Required<AllowOptions>;
  #enable: boolean;
  #maxAge: number;

  constructor() {
    this.#allowOptions = {
      headers: '*',
      methods: '*',
      origin: () => true,
    };
    this.#enable = false;
    this.#maxAge = 600;
  }

  getExtraHeaders(method: string, origin?: string): OutgoingHttpHeaders {
    if (!this.#enable) return {};
    if (origin === undefined) return {};
    if (!this.#allowOptions.origin(origin)) return {};
    if (method === 'OPTIONS') {
      return {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': this.#allowOptions.headers,
        'Access-Control-Allow-Methods': this.#allowOptions.methods,
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Max-Age': this.#maxAge,
      };
    }
    return {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin,
    };
  }

  getHandler(method: string, origin?: string): Handler | null {
    if (!this.#enable) return null;
    if (origin === undefined) return null;
    if (!this.#allowOptions.origin(origin)) return forbiddenHandler;
    if (method === 'OPTIONS') return preflightHandler;
    return null;
  }

  setAllowOptions(allOptions: AllowOptions): void {
    this.#allowOptions = {
      ...this.#allowOptions,
      ...allOptions,
    };
  }

  setEnable(enable: boolean): void {
    this.#enable = enable;
  }

  setMaxAge(maxAge: number): void {
    this.#maxAge = maxAge;
  }
}

export { Cors as default };
