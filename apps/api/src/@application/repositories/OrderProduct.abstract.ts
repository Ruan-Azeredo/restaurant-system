import { IOrderProduct } from "@application/entities/OrderProduct";

export abstract class IOrderProductRepository {
  abstract createMany(
    products: Omit<IOrderProduct, "id" | "createdAt" | "updatedAt">[]
  ): Promise<IOrderProduct[]>;
  abstract findByOrderId(order_id: string): Promise<IOrderProduct[]>;
}
