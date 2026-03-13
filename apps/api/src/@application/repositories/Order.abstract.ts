import { IOrder } from "@application/entities/Order";

export abstract class IOrderRepository {
  abstract create(order: Omit<IOrder, "id" | "createdAt" | "updatedAt">): Promise<IOrder>;
}
