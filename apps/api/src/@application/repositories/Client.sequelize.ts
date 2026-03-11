import { IClient } from "@application/entities/Client";
import { IClientRepository } from "@application/repositories/Client.abstract";

export class ClientSequelizeRepository implements IClientRepository {
  async create(client: IClient): Promise<IClient> {
    throw new Error("Method not implemented.");
  }
  async update(client: IClient): Promise<IClient> {
    throw new Error("Method not implemented.");
  }
  async delete(client: IClient): Promise<IClient> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<IClient> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<IClient[]> {
    throw new Error("Method not implemented.");
  }
}
