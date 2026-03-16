import { IOrderRepository } from "@application/repositories/Order.abstract";
import { IOrder } from "@application/entities/Order";
import { getIo } from "@src/@infra/http/socket/socketServer";

interface UpdateOrderStatusRequest {
  id: string;
  status: string;
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(request: UpdateOrderStatusRequest): Promise<IOrder> {
    const { id, status } = request;
    const updatedOrder = await this.orderRepository.updateStatus(id, status);

    const io = getIo();
    // Emit to a general room or specific order room
    // Here we emit to both order-specific room and a global admin room if needed
    io.to(`order:${id}`).emit("order-status-updated", {
      order_id: id,
      status: updatedOrder.status,
    });

    // Also emit to a global room for admin dashboard monitoring
    io.emit("order-status-updated", {
      order_id: id,
      status: updatedOrder.status,
    });

    return updatedOrder;
  }
}
