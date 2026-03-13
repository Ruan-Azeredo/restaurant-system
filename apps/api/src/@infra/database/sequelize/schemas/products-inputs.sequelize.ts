import { DataTypes } from "sequelize";
import sequelize from "../connection";
import ProductModel from "./products.sequelize";
import InputModel from "./inputs.sequelize";

const ProductInputModel = sequelize.define("products_inputs", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  input_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  input_quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Associations
ProductModel.belongsToMany(InputModel, { through: ProductInputModel, foreignKey: 'product_id' });
InputModel.belongsToMany(ProductModel, { through: ProductInputModel, foreignKey: 'input_id' });

export default ProductInputModel;
