import { type Handler } from './handler';
import { type ServerResponseHeaders } from './server';

interface Route {
  method: string[];
  pathname: RegExp;
  handler: Handler;
}

const validMethod = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'PATCH',
  'TRACE',
];

class Router {
  #routingTable: Route[];

  constructor() {
    this.#routingTable = [];
  }

  getExtraHeaders(): ServerResponseHeaders {
    return {};
  }

  getHandler(method: string, pathname: string): Handler | null {
    const route = this.#routingTable.find((route) => {
      if (!route.method.includes(method)) return false;
      if (!route.pathname.test(pathname)) return false;
      return true;
    });
    return route?.handler || null;
  }

  route(
    method: string | string[],
    pathname: string | RegExp,
    handler?: Handler,
  ): void {
    const methodArray = (Array.isArray(method) ? method : [method]).map(
      (method) => method.toUpperCase(),
    );
    const validMethodArray = validMethod.filter((method) => {
      if (methodArray.includes(method)) return true;
      return methodArray.includes('ALL');
    });
    this.#routingTable.push({
      method: validMethodArray,
      pathname:
        pathname instanceof RegExp
          ? pathname
          : pathname.startsWith('/')
          ? new RegExp('^' + pathname)
          : new RegExp('^/' + pathname),
      handler:
        handler ||
        (() => {
          return;
        }),
    });
  }
}

export { Router as default };
