"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    
    await ProductModel.create({
      name: "Cake",
      imgUrl: "https://example.com/cake.png",
      available: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    await ProductModel.destroy({ where: { name: "Cake" } });
  },
};
