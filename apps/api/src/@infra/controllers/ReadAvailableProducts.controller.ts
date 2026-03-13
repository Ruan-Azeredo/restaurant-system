import { Request, Response } from "express";
import { IController, IHttpResponse } from ".";
import { IProduct } from "@application/entities/Product";
import { ProductSequelizeRepository } from "@application/repositories/Product.sequelize";
import { ReadAvailableProductsUseCase } from "@application/usecases/product/ReadAvailableProducts.usecase";

export class ReadAvailableProductsController
  extends IController<{
    products: IProduct[];
  }>
{
  async handle(
    _req: Request,
    _res: Response,
  ): Promise<IHttpResponse<{ products: IProduct[] }>> {
    console.log("READ_AVAILABLE_PRODUCTS_CONTROLLER");
    const productRepository = new ProductSequelizeRepository();
    const readAvailableProductsUseCase = new ReadAvailableProductsUseCase(
      productRepository,
    );
    const products = await readAvailableProductsUseCase.execute();

    return {
      statusCode: 200,
      body: { products },
    };
  }
}
