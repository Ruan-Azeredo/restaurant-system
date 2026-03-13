import { Request, Response } from "express";
import { IController, IHttpResponse } from ".";
import { enqueueOrder } from "@application/services/queue/orderQueue";

interface CreateOrderQueuedResponse {
  job_id: string;
  message: string;
}

export class CreateOrderController extends IController<CreateOrderQueuedResponse> {
  async handle(
    req: Request,
    _res: Response
  ): Promise<IHttpResponse<CreateOrderQueuedResponse>> {
    console.log("CREATE_ORDER_CONTROLLER");

    const { client_id, order_products } = req.body;

    const jobId = await enqueueOrder({ client_id, order_products });

    return {
      statusCode: 202,
      body: {
        job_id: jobId,
        message: "Order queued for processing. It will be confirmed shortly.",
      },
    };
  }
}
