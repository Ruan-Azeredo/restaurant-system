import { IOrderProduct } from "@application/entities/OrderProduct";
import { IOrderProductRepository } from "@application/repositories/OrderProduct.abstract";
import OrderProductModel from "@src/@infra/database/sequelize/schemas/order-products.sequelize";

export class OrderProductSequelizeRepository implements IOrderProductRepository {
  async createMany(
    products: Omit<IOrderProduct, "id" | "createdAt" | "updatedAt">[]
  ): Promise<IOrderProduct[]> {
    const createdProducts = await OrderProductModel.bulkCreate(
      products.map((p) => ({
        order_id: p.order_id,
        product_id: p.product_id,
        quantity: p.quantity,
        observation: p.observation,
      }))
    );
    return createdProducts.map((p) => p.toJSON() as IOrderProduct);
  }
}
