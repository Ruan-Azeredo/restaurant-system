import { DataTypes } from "sequelize";
import sequelize from "../connection";
import ClientModel from "./clients.sequelize";

const OrderModel = sequelize.define("orders", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
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
ClientModel.hasMany(OrderModel, { foreignKey: 'client_id' });
OrderModel.belongsTo(ClientModel, { foreignKey: 'client_id' });

export default OrderModel;
