import { IController, IHttpResponse } from ".";
import { Request, Response } from "express";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { OrderProductSequelizeRepository } from "@application/repositories/OrderProduct.sequelize";
import { ProductSequelizeRepository } from "@application/repositories/Product.sequelize";
import { OrderResponse, ReadOrdersByClientUseCase } from "@application/usecases/order/ReadOrdersByClient.usecase";

export class ReadOrdersByClientController extends IController<OrderResponse[]> {
  async handle(
    req: Request,
    _res: Response,
  ): Promise<IHttpResponse<OrderResponse[]>> {
    const { client_id } = req.query as { client_id: string };
    console.log("READ_ORDERS_BY_CLIENT_CONTROLLER hit with client_id:", client_id);
    
    const orderRepository = new OrderSequelizeRepository();
    const orderProductRepository = new OrderProductSequelizeRepository();
    const productRepository = new ProductSequelizeRepository();

    const readOrdersByClientUseCase = new ReadOrdersByClientUseCase(
      orderRepository,
      orderProductRepository,
      productRepository,
    );
    
    const ordersResponse = await readOrdersByClientUseCase.execute({ client_id });

    return {
      statusCode: 200,
      body: ordersResponse,
    };
  }
}
