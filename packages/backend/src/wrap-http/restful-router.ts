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

  private getValidMethod(method: string | string[]): string[] {
    const methodArray = (Array.isArray(method) ? method : [method]).map(
      (method) => method.toUpperCase(),
    );
    return validMethod.filter((method) => {
      if (methodArray.includes(method)) return true;
      return methodArray.includes('ALL');
    });
  }

  private getValidPathname(pathname: string | RegExp): RegExp {
    if (pathname instanceof RegExp) return pathname;
    const prefix = pathname.startsWith('/') ? '^' : '^/';
    const suffix = pathname.endsWith('/') ? '' : '/?$';
    return RegExp(prefix + pathname + suffix);
  }

  public setRoute(
    method: string | string[],
    pathname: string | RegExp,
    handler?: Handler,
  ): void {
    this.routingTable.push({
      method: this.getValidMethod(method),
      pathname: this.getValidPathname(pathname),
      handler:
        handler ||
        (() => {
          return;
        }),
    });
  }
}

export { RestfulRouter as default };
