import { IProductInput } from "@application/entities/ProductInput";

export abstract class IProductInputRepository {
  abstract findByProductIds(productIds: string[]): Promise<IProductInput[]>;
}
