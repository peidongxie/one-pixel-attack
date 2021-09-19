import { form, json, text } from 'co-body';
import type { IncomingMessage } from 'http';
import typeis from 'type-is';

const jsonTypes = [
  'application/json',
  'application/json-patch+json',
  'application/vnd.api+json',
  'application/csp-report',
];
const formTypes = ['application/x-www-form-urlencoded'];
const textTypes = ['text/plain'];
const xmlTypes = ['text/xml', 'application/xml'];

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

export const receive = async <T>(req: IncomingMessage): Promise<T> => {
  if (typeis(req, jsonTypes)) {
    return receiveJson(req);
  } else if (typeis(req, formTypes)) {
    return receiveForm(req);
  } else if (typeis(req, textTypes)) {
    return receiveText(req);
  } else if (typeis(req, xmlTypes)) {
    return receiveXml(req);
  }
  throw new Error('Invalid Content-Type');
};
