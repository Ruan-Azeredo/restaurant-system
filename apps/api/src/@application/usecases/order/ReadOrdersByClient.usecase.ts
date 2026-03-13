import { IOrder } from "@application/entities/Order";
import { IOrderRepository } from "@application/repositories/Order.abstract";

interface ReadOrdersByClientRequest {
  client_id: string;
}

interface ReadOrdersByClientResponse {
  orders: IOrder[];
}

export class ReadOrdersByClientUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    request: ReadOrdersByClientRequest,
  ): Promise<ReadOrdersByClientResponse> {
    const { client_id } = request;
    const orders = await this.orderRepository.findByClientId(client_id);
    return { orders };
  }
}
