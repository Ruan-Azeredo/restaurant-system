import { IOrder } from "@application/entities/Order";
import { IOrderRepository } from "@application/repositories/Order.abstract";
import OrderModel from "@src/@infra/database/sequelize/schemas/orders.sequelize";

export class OrderSequelizeRepository implements IOrderRepository {
  async create(
    order: Omit<IOrder, "id" | "createdAt" | "updatedAt">
  ): Promise<IOrder> {
    const createdOrder = await OrderModel.create({
      client_id: order.client_id,
      status: order.status,
    });
    return createdOrder.toJSON() as IOrder;
  }
}
