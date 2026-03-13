import { IInput } from "@application/entities/Input";

export abstract class IInputRepository {
  abstract findByIds(ids: string[]): Promise<IInput[]>;
}
