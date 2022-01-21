import { type HandlerRequest } from './request';
import { type HandlerResponse } from './response';

type Handler = (
  req: HandlerRequest,
) => void | HandlerResponse | Promise<void | HandlerResponse>;

export { type Handler };
