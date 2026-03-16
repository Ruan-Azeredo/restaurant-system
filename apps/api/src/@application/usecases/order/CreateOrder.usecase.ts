import { IOrder } from "@application/entities/Order";
import { IOrderProduct } from "@application/entities/OrderProduct";
import { IOrderRepository } from "@application/repositories/Order.abstract";
import { IOrderProductRepository } from "@application/repositories/OrderProduct.abstract";
import {
  VerifyIngredientsService,
  InputVerificationResult,
} from "@application/services/VerifyIngredients.service";

interface CreateOrderRequest {
  client_id: string;
  order_products: {
    product_id: string;
    quantity: number;
    observation?: string;
  }[];
}

interface CreateOrderResponse {
  order: IOrder;
  order_products: IOrderProduct[];
  ingredient_verification: InputVerificationResult[];
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderProductRepository: IOrderProductRepository,
    private readonly verifyIngredientsService: VerifyIngredientsService,
  ) {}

  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const { client_id, order_products } = request;

    // 1. Verify if there's enough ingredient stock
    const ingredientVerification =
      await this.verifyIngredientsService.execute(order_products);

    if (!ingredientVerification.can_fulfill) {
      throw new Error("Insufficient ingredients to fulfill the order.", {
        cause: ingredientVerification.details,
      });
    }

    // 2. Create the base order with "client-order" status
    const order = await this.orderRepository.create({
      client_id,
      status: "client-order",
    });

    // 3. Map the incoming products to be created with the new order ID
    const orderProductsData = order_products.map((p) => ({
      order_id: order.id,
      product_id: p.product_id,
      quantity: p.quantity,
      observation: p.observation || null,
    }));

    // 4. Create the order products
    const createdOrderProducts =
      await this.orderProductRepository.createMany(orderProductsData);

    // 5. Return the aggregated result
    return {
      order,
      order_products: createdOrderProducts,
      ingredient_verification: ingredientVerification.details,
    };
  }
}
