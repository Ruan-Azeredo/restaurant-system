import { IController, IHttpResponse } from ".";
import { Request, Response } from "express";
import { IOrder } from "@application/entities/Order";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { ReadOrdersByClientUseCase } from "@application/usecases/order/ReadOrdersByClient.usecase";

export class ReadOrdersByClientController extends IController<{
  orders: IOrder[];
}> {
  async handle(
    req: Request,
    _res: Response,
  ): Promise<IHttpResponse<{ orders: IOrder[] }>> {
    const { client_id } = req.query as { client_id: string };
    console.log("READ_ORDERS_BY_CLIENT_CONTROLLER hit with client_id:", client_id);
    const orderRepository = new OrderSequelizeRepository();
    const readOrdersByClientUseCase = new ReadOrdersByClientUseCase(
      orderRepository,
    );
    const orders = await readOrdersByClientUseCase.execute({ client_id });

    return {
      statusCode: 200,
      body: orders,
    };
  }
}
