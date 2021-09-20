import parse, { form, json, text } from 'co-body';
import type { IncomingMessage } from 'http';
import typeis from 'type-is';

export const jsonTypes = [
  'application/json',
  'application/json-patch+json',
  'application/vnd.api+json',
  'application/csp-report',
];
export const formTypes = ['application/x-www-form-urlencoded'];
export const textTypes = ['text/plain'];
export const xmlTypes = ['text/xml', 'application/xml'];

export const receiveJson = async <T>(req: IncomingMessage): Promise<T> => {
  return json(req);
};

export const receiveForm = async <T>(req: IncomingMessage): Promise<T> => {
  return form(req);
};

export const receiveText = async <T>(req: IncomingMessage): Promise<T> => {
  return text(req);
};

export const receiveXml = async <T>(req: IncomingMessage): Promise<T> => {
  return text(req);
};

export const receiveAny = async <T>(req: IncomingMessage): Promise<T> => {
  return parse(req);
};

export const receive = async <T>(req: IncomingMessage): Promise<T> => {
  if (typeis(req, jsonTypes)) {
    return receiveJson<T>(req);
  } else if (typeis(req, formTypes)) {
    return receiveForm<T>(req);
  } else if (typeis(req, textTypes)) {
    return receiveText<T>(req);
  } else if (typeis(req, xmlTypes)) {
    return receiveXml<T>(req);
  } else {
    return receiveAny<T>(req);
  }
};
