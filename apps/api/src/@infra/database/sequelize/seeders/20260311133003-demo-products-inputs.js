"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    const InputModel = require("../schemas/inputs.sequelize.ts").default;
    const ProductInputModel = require("../schemas/products-inputs.sequelize.ts").default;

    const cake = await ProductModel.findOne({ where: { name: "Cake" } });
    const flour = await InputModel.findOne({ where: { name: "Flour" } });
    const sugar = await InputModel.findOne({ where: { name: "Sugar" } });

    if (cake && flour && sugar) {
      await ProductInputModel.create({
        product_id: cake.id,
        input_id: flour.id,
        input_quantity: 0.5, // 0.5 kg of flour for a cake
      });
      await ProductInputModel.create({
        product_id: cake.id,
        input_id: sugar.id,
        input_quantity: 0.2, // 0.2 kg of sugar
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    const ProductInputModel = require("../schemas/products-inputs.sequelize.ts").default;
    
    const cake = await ProductModel.findOne({ where: { name: "Cake" } });
    if (cake) {
      await ProductInputModel.destroy({ where: { product_id: cake.id } });
    }
  },
};
