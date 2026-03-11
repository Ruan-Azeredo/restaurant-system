export interface IHttpRequest {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

export interface IHttpResponse<RESPONSE> {
  statusCode: number;
  body: RESPONSE;
}

export abstract class IController<RESPONSE> {
  abstract handle(request: IHttpRequest): Promise<IHttpResponse<RESPONSE>>;
}

export default { IController };
