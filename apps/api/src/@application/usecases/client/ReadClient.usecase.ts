import { IClient } from "@application/entities/Client";
import { IClientRepository } from "@application/repositories/Client.abstract";

export class ReadClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(): Promise<IClient[]> {
    return this.clientRepository.findAll();
  }
}
