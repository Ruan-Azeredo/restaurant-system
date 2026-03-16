import { IProduct } from "@application/entities/Product";

export abstract class IProductRepository {
  abstract findAllAvailable(): Promise<IProduct[]>;
  abstract findByIds(ids: string[]): Promise<IProduct[]>;
}
