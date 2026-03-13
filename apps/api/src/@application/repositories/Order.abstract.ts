import { IOrder } from "@application/entities/Order";

export abstract class IOrderRepository {
  abstract create(
    order: Omit<IOrder, "id" | "createdAt" | "updatedAt">,
  ): Promise<IOrder>;
  abstract findByClientId(client_id: string): Promise<IOrder[]>;
}
