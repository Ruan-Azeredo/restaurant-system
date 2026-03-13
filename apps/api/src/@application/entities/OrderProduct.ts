export interface IOrderProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
}
