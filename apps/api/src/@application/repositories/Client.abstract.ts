import { IClient } from "@application/entities/Client";

export abstract class IClientRepository {
  abstract create(client: IClient): Promise<IClient>;
  abstract update(client: IClient): Promise<IClient>;
  abstract delete(client: IClient): Promise<IClient>;
  abstract findById(id: string): Promise<IClient>;
  abstract findAll(): Promise<IClient[]>;
}
