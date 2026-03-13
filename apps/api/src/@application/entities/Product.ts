export interface IProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imgUrl: string | null;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}
