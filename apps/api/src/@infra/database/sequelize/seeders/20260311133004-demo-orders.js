"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ClientModel = require("../schemas/clients.sequelize.ts").default;
    const OrderModel = require("../schemas/orders.sequelize.ts").default;

    const client = await ClientModel.findOne({ where: { name: "John Doe" } });

    if (client) {
      await OrderModel.create({
        client_id: client.id,
        status: "pending",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const OrderModel = require("../schemas/orders.sequelize.ts").default;
    await OrderModel.destroy({ where: { status: "pending" } });
  },
};
