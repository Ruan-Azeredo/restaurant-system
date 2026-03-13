import { IProduct } from "@application/entities/Product";
import { IProductRepository } from "@application/repositories/Product.abstract";
import ProductModel from "@src/@infra/database/sequelize/schemas/products.sequelize";

export class ProductSequelizeRepository implements IProductRepository {
  async findAllAvailable(): Promise<IProduct[]> {
    const products = await ProductModel.findAll({
      where: {
        available: true,
      },
    });
    return products.map((product) => product.toJSON() as IProduct);
  }
}
