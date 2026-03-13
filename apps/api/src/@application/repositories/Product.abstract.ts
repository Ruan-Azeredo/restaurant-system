import { IProduct } from "@application/entities/Product";

export abstract class IProductRepository {
  abstract findAllAvailable(): Promise<IProduct[]>;
  // Additional methods like create, update, delete, findById can be added later
}
