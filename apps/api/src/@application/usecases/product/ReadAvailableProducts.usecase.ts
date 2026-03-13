import { IProduct } from "@application/entities/Product";
import { IProductRepository } from "@application/repositories/Product.abstract";

export class ReadAvailableProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<IProduct[]> {
    return this.productRepository.findAllAvailable();
  }
}
