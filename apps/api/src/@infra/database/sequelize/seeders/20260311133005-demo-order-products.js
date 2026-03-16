"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const OrderModel = require("../schemas/orders.sequelize.ts").default;
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    const OrderProductModel =
      require("../schemas/order-products.sequelize.ts").default;

    const order = await OrderModel.findOne({
      where: { status: "client-order" },
    });
    const product = await ProductModel.findOne({ where: { name: "Cake" } });

    if (order && product) {
      await OrderProductModel.findOrCreate({
        where: { order_id: order.id, product_id: product.id },
        defaults: {
          quantity: 2,
          observation: "Extra frosting please",
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const OrderModel = require("../schemas/orders.sequelize.ts").default;
    const OrderProductModel =
      require("../schemas/order-products.sequelize.ts").default;

    const order = await OrderModel.findOne({
      where: { status: "client-order" },
    });
    if (order) {
      await OrderProductModel.destroy({ where: { order_id: order.id } });
    }
  },
};
