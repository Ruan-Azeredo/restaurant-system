import { ReadClientUseCase } from "@application/usecases/client/ReadClient.usecase";
import { Request, Response } from "express";
import { ClientSequelizeRepository } from "@application/repositories/Client.sequelize";
import { IController, IHttpResponse } from ".";
import { IClient } from "@application/entities/Client";

export class ReadClientController extends IController<{ clients: IClient[] }> {
  async handle(
    req: Request,
    res: Response,
  ): Promise<IHttpResponse<{ clients: IClient[] }>> {
    console.log("READ_CLIENT_CONTROLLER");
    const clientRepository = new ClientSequelizeRepository();
    const readClientUseCase = new ReadClientUseCase(clientRepository);
    const clients = await readClientUseCase.execute();

    return {
      statusCode: 200,
      body: { clients },
    };
  }
}
