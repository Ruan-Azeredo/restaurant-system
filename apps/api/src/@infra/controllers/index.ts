import { Response, Request } from "express";

export interface IHttpResponse<RESPONSE> {
  statusCode: number;
  body: RESPONSE;
}

export abstract class IController<RESPONSE> {
  abstract handle(
    req: Request,
    res: Response,
  ): Promise<IHttpResponse<RESPONSE>>;
}

export default { IController };
