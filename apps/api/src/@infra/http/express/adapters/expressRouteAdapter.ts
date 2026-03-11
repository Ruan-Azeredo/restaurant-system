import { Response, NextFunction, Request } from "express";
import { IController } from "@infra/controllers/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptRoute = (controller: IController<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const httpResponse = await controller.handle({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
      });

      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      // This will be handled by the catchError middleware
      next(error);
    }
  };
};

export default { adaptRoute };
