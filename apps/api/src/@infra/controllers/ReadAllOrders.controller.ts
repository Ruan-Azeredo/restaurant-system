import { IController, IHttpResponse } from ".";
import { Request, Response } from "express";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { OrderProductSequelizeRepository } from "@application/repositories/OrderProduct.sequelize";
import { ProductSequelizeRepository } from "@application/repositories/Product.sequelize";
import { OrderResponse } from "@application/usecases/order/ReadOrdersByClient.usecase";
import { ReadAllOrdersUseCase } from "@application/usecases/order/ReadAllOrders.usecase";

export class ReadAllOrdersController extends IController<OrderResponse[]> {
  async handle(
    _req: Request,
    _res: Response,
  ): Promise<IHttpResponse<OrderResponse[]>> {
    console.log("READ_ALL_ORDERS_CONTROLLER hit");
    
    const orderRepository = new OrderSequelizeRepository();
    const orderProductRepository = new OrderProductSequelizeRepository();
    const productRepository = new ProductSequelizeRepository();

    const readAllOrdersUseCase = new ReadAllOrdersUseCase(
      orderRepository,
      orderProductRepository,
      productRepository,
    );
    
    const ordersResponse = await readAllOrdersUseCase.execute();

    return {
      statusCode: 200,
      body: ordersResponse,
    };
  }
}
