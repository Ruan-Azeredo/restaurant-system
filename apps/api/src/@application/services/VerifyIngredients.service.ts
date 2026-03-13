import { IInputRepository } from "@application/repositories/Input.abstract";
import { IProductInputRepository } from "@application/repositories/ProductInput.abstract";

export interface InputVerificationResult {
  input_id: string;
  input_name: string;
  required_quantity: number;
  stock_quantity_before: number;
  stock_quantity_after: number;
  is_sufficient: boolean;
}

export interface VerifyIngredientsResponse {
  can_fulfill: boolean;
  details: InputVerificationResult[];
}

export class VerifyIngredientsService {
  constructor(
    private readonly inputRepository: IInputRepository,
    private readonly productInputRepository: IProductInputRepository
  ) {}

  async execute(
    orderProducts: { product_id: string; quantity: number }[]
  ): Promise<VerifyIngredientsResponse> {
    // 1. Get all unique product IDs from the order
    const productIds = Array.from(
      new Set(orderProducts.map((op) => op.product_id))
    );

    // 2. Fetch all required inputs for these products
    const productInputs = await this.productInputRepository.findByProductIds(
      productIds
    );

    // 3. Aggregate required quantities per input ID
    const requiredQuantities: Record<string, number> = {};
    for (const op of orderProducts) {
      // Find all inputs required for this product
      const inputsForProduct = productInputs.filter(
        (pi) => pi.product_id === op.product_id
      );

      for (const pi of inputsForProduct) {
        if (!requiredQuantities[pi.input_id]) {
          requiredQuantities[pi.input_id] = 0;
        }
        requiredQuantities[pi.input_id] += pi.input_quantity * op.quantity;
      }
    }

    // 4. Fetch the input details to check stock and names
    const inputIdsToFetch = Object.keys(requiredQuantities);
    const inputs = await this.inputRepository.findByIds(inputIdsToFetch);

    // 5. Compare required vs available quantities
    let canFulfill = true;
    const details: InputVerificationResult[] = [];

    for (const input of inputs) {
      const required = requiredQuantities[input.id] || 0;
      const remains = input.stock_quantity - required;
      const isSufficient = remains >= 0;

      if (!isSufficient) {
        canFulfill = false;
      }

      details.push({
        input_id: input.id,
        input_name: input.name,
        required_quantity: required,
        stock_quantity_before: input.stock_quantity,
        stock_quantity_after: remains,
        is_sufficient: isSufficient,
      });
    }

    // Edge case if a product has inputs but the ingredient doesn't exist in DB
    // Though rare if constraints setup correctly.
    if (inputs.length !== inputIdsToFetch.length) {
      canFulfill = false;
    }

    return {
      can_fulfill: canFulfill,
      details,
    };
  }
}
