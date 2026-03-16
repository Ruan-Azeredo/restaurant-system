import { IOrderRepository } from "@application/repositories/Order.abstract";
import { IOrderProductRepository } from "@application/repositories/OrderProduct.abstract";
import { IProductRepository } from "@application/repositories/Product.abstract";
import { OrderResponse, OrderProductResponse } from "./ReadOrdersByClient.usecase";

export class ReadAllOrdersUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderProductRepository: IOrderProductRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.findAll();

    const response: OrderResponse[] = [];

    for (const order of orders) {
      const orderProducts = await this.orderProductRepository.findByOrderId(order.id);
      
      const productIds = orderProducts.map(op => op.product_id);
      const products = await this.productRepository.findByIds(productIds);

      const mappedProducts: OrderProductResponse[] = orderProducts.map(op => {
        const product = products.find(p => p.id === op.product_id);
        return {
          product_id: op.product_id,
          product_name: product?.name || "Unknown Product",
          product_quantity: op.quantity,
          product_description: product?.description || null,
          product_observation: op.observation,
          product_imgUrl: product?.imgUrl || null,
        };
      });

      response.push({
        order_id: order.id,
        order_status: order.status,
        order_createdAt: order.createdAt,
        order_products: mappedProducts,
      });
    }

    return response;
  }
}
