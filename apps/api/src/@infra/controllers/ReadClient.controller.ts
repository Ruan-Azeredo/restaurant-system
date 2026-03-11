import { ReadClientUseCase } from "@application/usecases/client/ReadClient.usecase";
import { Request, Response } from "express";
import { ClientSequelizeRepository } from "@application/repositories/Client.sequelize";
import { IController } from ".";

export class ReadClientController extends IController<{ clients: [] }> {
  async handle(req: Request, res: Response): Promise<Response> {
    const clientRepository = new ClientSequelizeRepository();
    const readClientUseCase = new ReadClientUseCase(clientRepository);
    const clients = await readClientUseCase.execute();

    return res.status(200).json(clients);
  }
}
