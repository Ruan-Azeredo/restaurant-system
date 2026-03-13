export interface IProduct {
  id: string;
  name: string;
  imgUrl: string | null;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}
