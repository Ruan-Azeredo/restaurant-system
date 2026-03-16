"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    const InputModel = require("../schemas/inputs.sequelize.ts").default;
    const ProductInputModel = require("../schemas/products-inputs.sequelize.ts").default;

    const recipeMap = {
      "Cake": [
        { ingredient: "Flour", quantity: 0.5 },
        { ingredient: "Sugar", quantity: 0.2 },
      ],
      "Classic Cheeseburger": [
        { ingredient: "Burger Bun", quantity: 1 },
        { ingredient: "Beef Patty", quantity: 1 },
        { ingredient: "Cheddar Cheese", quantity: 1 },
        { ingredient: "Lettuce", quantity: 0.1 },
        { ingredient: "Tomato", quantity: 0.2 },
      ],
      "Margherita Pizza": [
        { ingredient: "Pizza Dough", quantity: 1 },
        { ingredient: "Tomato Sauce", quantity: 0.2 },
        { ingredient: "Fresh Mozzarella", quantity: 0.2 },
        { ingredient: "Basil", quantity: 0.05 },
      ],
      "Caesar Salad": [
        { ingredient: "Romaine Lettuce", quantity: 0.5 },
        { ingredient: "Parmesan Cheese", quantity: 0.05 },
        { ingredient: "Croutons", quantity: 0.1 },
        { ingredient: "Caesar Dressing", quantity: 0.05 },
      ],
      "Spaghetti Carbonara": [
        { ingredient: "Spaghetti", quantity: 0.15 },
        { ingredient: "Pancetta", quantity: 0.1 },
        { ingredient: "Eggs", quantity: 1 },
        { ingredient: "Pecorino Cheese", quantity: 0.03 },
        { ingredient: "Black Pepper", quantity: 0.01 },
      ],
      "Grilled Salmon": [
        { ingredient: "Salmon Fillet", quantity: 1 },
        { ingredient: "Asparagus", quantity: 0.2 },
        { ingredient: "Lemon Butter", quantity: 0.05 },
      ],
      "Truffle Fries": [
        { ingredient: "Shoestring Fries", quantity: 0.2 },
        { ingredient: "Truffle Oil", quantity: 0.01 },
        { ingredient: "Parmesan Cheese", quantity: 0.02 },
      ],
      "Artisan Lemonade": [
        { ingredient: "Lemons", quantity: 2 },
        { ingredient: "Mint Leaves", quantity: 0.01 },
        { ingredient: "Agave", quantity: 0.03 },
      ],
    };

    for (const [productName, ingredients] of Object.entries(recipeMap)) {
      const product = await ProductModel.findOne({ where: { name: productName } });
      if (!product) continue;

      for (const item of ingredients) {
        const input = await InputModel.findOne({ where: { name: item.ingredient } });
        if (!input) continue;

        await ProductInputModel.findOrCreate({
          where: { product_id: product.id, input_id: input.id },
          defaults: { input_quantity: item.quantity },
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const ProductInputModel = require("../schemas/products-inputs.sequelize.ts").default;
    // Clearing the whole join table is safer for a demo/dev environment seeder down
    await ProductInputModel.destroy({ where: {}, truncate: true });
  },
};
