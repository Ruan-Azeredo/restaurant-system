import { IClient } from "@application/entities/Client";
import { IClientRepository } from "@application/repositories/Client.abstract";
import ClientModel from "@src/@infra/database/sequelize/schemas/clients.sequelize";

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
    const clients = await ClientModel.findAll();
    return clients.map((client) => client.toJSON() as IClient);
  }
}
