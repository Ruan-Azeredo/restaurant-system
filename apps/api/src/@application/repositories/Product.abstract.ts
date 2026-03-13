import { IProduct } from "@application/entities/Product";

export abstract class IProductRepository {
  abstract findAllAvailable(): Promise<IProduct[]>;
}
