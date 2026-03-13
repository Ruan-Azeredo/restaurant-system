import { IProductInput } from "@application/entities/ProductInput";
import { IProductInputRepository } from "@application/repositories/ProductInput.abstract";
import ProductInputModel from "@src/@infra/database/sequelize/schemas/products-inputs.sequelize";
import { Op } from "sequelize";

export class ProductInputSequelizeRepository implements IProductInputRepository {
  async findByProductIds(productIds: string[]): Promise<IProductInput[]> {
    const productInputs = await ProductInputModel.findAll({
      where: {
        product_id: {
          [Op.in]: productIds,
        },
      },
    });
    return productInputs.map((pi) => pi.toJSON() as IProductInput);
  }
}
