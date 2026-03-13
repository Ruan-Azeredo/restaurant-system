import { IInput } from "@application/entities/Input";
import { IInputRepository } from "@application/repositories/Input.abstract";
import InputModel from "@src/@infra/database/sequelize/schemas/inputs.sequelize";
import { Op } from "sequelize";

export class InputSequelizeRepository implements IInputRepository {
  async findByIds(ids: string[]): Promise<IInput[]> {
    const inputs = await InputModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return inputs.map((input) => input.toJSON() as IInput);
  }
}
