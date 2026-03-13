import { DataTypes } from "sequelize";
import sequelize from "../connection";
import OrderModel from "./orders.sequelize";
import ProductModel from "./products.sequelize";

const OrderProductModel = sequelize.define("order_products", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  observation: {
    type: DataTypes.STRING,
    allowNull: true,
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
OrderModel.belongsToMany(ProductModel, { through: OrderProductModel, foreignKey: 'order_id' });
ProductModel.belongsToMany(OrderModel, { through: OrderProductModel, foreignKey: 'product_id' });

export default OrderProductModel;
