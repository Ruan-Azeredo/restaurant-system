"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const InputModel = require("../schemas/inputs.sequelize.ts").default;

    const inputs = [
      { name: "Flour", stock_quantity: 50.0, quantity_unit: "kg" },
      { name: "Sugar", stock_quantity: 20.0, quantity_unit: "kg" },
      { name: "Beef Patty", stock_quantity: 100, quantity_unit: "unit" },
      { name: "Burger Bun", stock_quantity: 100, quantity_unit: "unit" },
      { name: "Cheddar Cheese", stock_quantity: 50, quantity_unit: "slice" },
      { name: "Lettuce", stock_quantity: 30, quantity_unit: "head" },
      { name: "Tomato", stock_quantity: 40, quantity_unit: "unit" },
      { name: "Pizza Dough", stock_quantity: 60, quantity_unit: "unit" },
      { name: "Tomato Sauce", stock_quantity: 20, quantity_unit: "liter" },
      { name: "Fresh Mozzarella", stock_quantity: 15, quantity_unit: "kg" },
      { name: "Basil", stock_quantity: 5, quantity_unit: "kg" },
      { name: "Romaine Lettuce", stock_quantity: 25, quantity_unit: "head" },
      { name: "Parmesan Cheese", stock_quantity: 10, quantity_unit: "kg" },
      { name: "Croutons", stock_quantity: 5, quantity_unit: "kg" },
      { name: "Caesar Dressing", stock_quantity: 10, quantity_unit: "liter" },
      { name: "Spaghetti", stock_quantity: 40, quantity_unit: "kg" },
      { name: "Pancetta", stock_quantity: 15, quantity_unit: "kg" },
      { name: "Eggs", stock_quantity: 300, quantity_unit: "unit" },
      { name: "Pecorino Cheese", stock_quantity: 8, quantity_unit: "kg" },
      { name: "Black Pepper", stock_quantity: 2, quantity_unit: "kg" },
      { name: "Salmon Fillet", stock_quantity: 30, quantity_unit: "unit" },
      { name: "Asparagus", stock_quantity: 15, quantity_unit: "kg" },
      { name: "Lemon Butter", stock_quantity: 5, quantity_unit: "liter" },
      { name: "Shoestring Fries", stock_quantity: 50, quantity_unit: "kg" },
      { name: "Truffle Oil", stock_quantity: 2, quantity_unit: "liter" },
      { name: "Lemons", stock_quantity: 100, quantity_unit: "unit" },
      { name: "Mint Leaves", stock_quantity: 1, quantity_unit: "kg" },
      { name: "Agave", stock_quantity: 3, quantity_unit: "liter" },
    ];

    for (const input of inputs) {
      await InputModel.findOrCreate({
        where: { name: input.name },
        defaults: input,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const InputModel = require("../schemas/inputs.sequelize.ts").default;
    const names = [
      "Flour", "Sugar", "Beef Patty", "Burger Bun", "Cheddar Cheese",
      "Lettuce", "Tomato", "Pizza Dough", "Tomato Sauce", "Fresh Mozzarella",
      "Basil", "Romaine Lettuce", "Parmesan Cheese", "Croutons", "Caesar Dressing",
      "Spaghetti", "Pancetta", "Eggs", "Pecorino Cheese", "Black Pepper",
      "Salmon Fillet", "Asparagus", "Lemon Butter", "Shoestring Fries",
      "Truffle Oil", "Lemons", "Mint Leaves", "Agave"
    ];
    await InputModel.destroy({ where: { name: names } });
  },
};
