import { IController, IHttpResponse } from ".";
import { Request, Response } from "express";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { IOrder } from "@application/entities/Order";
import { UpdateOrderStatusUseCase } from "@application/usecases/order/UpdateOrderStatus.usecase";

export class UpdateOrderStatusController extends IController<IOrder> {
  async handle(req: Request, _res: Response): Promise<IHttpResponse<IOrder>> {
    const { id } = req.params;
    const { status } = req.body as { status: string };

    console.log(
      `UPDATE_ORDER_STATUS_CONTROLLER hit for order ${id} with status ${status}`,
    );

    const orderRepository = new OrderSequelizeRepository();
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
      orderRepository,
    );

    const updatedOrder = await updateOrderStatusUseCase.execute({
      id: id as string,
      status: status as string,
    });

    return {
      statusCode: 200,
      body: updatedOrder,
    };
  }
}
