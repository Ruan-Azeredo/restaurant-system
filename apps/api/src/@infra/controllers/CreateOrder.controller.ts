import { Request, Response } from "express";
import { IController, IHttpResponse } from ".";
import { IOrder } from "@application/entities/Order";
import { IOrderProduct } from "@application/entities/OrderProduct";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { OrderProductSequelizeRepository } from "@application/repositories/OrderProduct.sequelize";
import { CreateOrderUseCase } from "@application/usecases/order/CreateOrder.usecase";
import { VerifyIngredientsService, InputVerificationResult } from "@application/services/VerifyIngredients.service";
import { InputSequelizeRepository } from "@application/repositories/Input.sequelize";
import { ProductInputSequelizeRepository } from "@application/repositories/ProductInput.sequelize";

interface CreateOrderResponse {
  order: IOrder;
  order_products: IOrderProduct[];
  ingredient_verification: InputVerificationResult[];
}

export class CreateOrderController extends IController<CreateOrderResponse> {
  async handle(
    req: Request,
    _res: Response
  ): Promise<IHttpResponse<CreateOrderResponse>> {
    console.log("CREATE_ORDER_CONTROLLER");
    
    // In a real scenario, we should validate the request body before using it
    const { client_id, order_products } = req.body;

    const orderRepository = new OrderSequelizeRepository();
    const orderProductRepository = new OrderProductSequelizeRepository();
    const inputRepository = new InputSequelizeRepository();
    const productInputRepository = new ProductInputSequelizeRepository();
    
    const verifyIngredientsService = new VerifyIngredientsService(
      inputRepository,
      productInputRepository
    );

    const createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      orderProductRepository,
      verifyIngredientsService
    );

    const result = await createOrderUseCase.execute({
      client_id,
      order_products,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }
}
