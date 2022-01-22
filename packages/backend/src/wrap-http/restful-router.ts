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

class RestfulRouter {
  private routingTable: Route[];

  public constructor() {
    this.routingTable = [];
  }

  public getExtraHeaders(): ServerResponseHeaders {
    return {};
  }

  public getHandler(method: string, pathname: string): Handler | null {
    const route = this.routingTable.find((route) => {
      if (!route.method.includes(method)) return false;
      if (!route.pathname.test(pathname)) return false;
      return true;
    });
    return route?.handler || null;
  }

  public setRoute(
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
    this.routingTable.push({
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

export { RestfulRouter as default };
