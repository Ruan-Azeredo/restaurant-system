"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const InputModel = require("../schemas/inputs.sequelize.ts").default;
    
    await InputModel.create({
      name: "Flour",
      stock_quantity: 50.0,
      quantity_unit: "kg",
    });

    await InputModel.create({
      name: "Sugar",
      stock_quantity: 20.0,
      quantity_unit: "kg",
    });
  },

  async down(queryInterface, Sequelize) {
    const InputModel = require("../schemas/inputs.sequelize.ts").default;
    await InputModel.destroy({ where: { name: ["Flour", "Sugar"] } });
  },
};
