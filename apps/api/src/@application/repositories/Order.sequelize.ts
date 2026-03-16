import { IOrder } from "@application/entities/Order";
import { IOrderRepository } from "@application/repositories/Order.abstract";
import OrderModel from "@src/@infra/database/sequelize/schemas/orders.sequelize";

export class OrderSequelizeRepository implements IOrderRepository {
  async create(
    order: Omit<IOrder, "id" | "createdAt" | "updatedAt">,
  ): Promise<IOrder> {
    const createdOrder = await OrderModel.create({
      client_id: order.client_id,
      status: order.status,
    });
    return createdOrder.toJSON() as IOrder;
  }

  async findByClientId(client_id: string): Promise<IOrder[]> {
    const orders = await OrderModel.findAll({
      where: { client_id },
      order: [["createdAt", "DESC"]],
    });
    return orders.map((order) => order.toJSON() as IOrder);
  }

  async findAll(): Promise<IOrder[]> {
    const orders = await OrderModel.findAll({
      order: [["createdAt", "DESC"]],
    });
    return orders.map((order) => order.toJSON() as IOrder);
  }

  async updateStatus(id: string, status: string): Promise<IOrder> {
    const order = await OrderModel.findByPk(id);
    if (!order) {
      throw new Error("Order not found");
    }
    await order.update({ status });
    return order.toJSON() as IOrder;
  }
}
