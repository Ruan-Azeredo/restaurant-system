"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;

    const products = [
      {
        name: "Cake",
        description: "Delicious chocolate layer cake with strawberry frosting.",
        price: 45.9,
        imgUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Classic Cheeseburger",
        description:
          "100% beef patty with melted cheddar, lettuce, tomato, and our secret sauce.",
        price: 32.5,
        imgUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Margherita Pizza",
        description:
          "Fresh mozzarella, San Marzano tomatoes, and basil on a wood-fired crust.",
        price: 54.0,
        imgUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce, parmesan cheese, croutons, and classic Caesar dressing.",
        price: 28.0,
        imgUrl:
          "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Spaghetti Carbonara",
        description:
          "Traditional Italian pasta with pancetta, egg yolk, pecorino cheese, and black pepper.",
        price: 48.9,
        imgUrl:
          "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Grilled Salmon",
        description:
          "Fresh Atlantic salmon fillet with asparagus and lemon butter sauce.",
        price: 72.0,
        imgUrl:
          "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Truffle Fries",
        description:
          "Crispy shoestring fries tossed in white truffle oil and parmesan.",
        price: 22.5,
        imgUrl:
          "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&auto=format&fit=crop&q=60",
        available: true,
      },
      {
        name: "Artisan Lemonade",
        description:
          "Freshly squeezed lemons with a hint of mint and agave sweetener.",
        price: 12.0,
        imgUrl:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
        available: false,
      },
    ];

    for (const product of products) {
      await ProductModel.findOrCreate({
        where: { name: product.name },
        defaults: product,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const ProductModel = require("../schemas/products.sequelize.ts").default;
    const names = [
      "Cake",
      "Classic Cheeseburger",
      "Margherita Pizza",
      "Caesar Salad",
      "Spaghetti Carbonara",
      "Grilled Salmon",
      "Truffle Fries",
      "Artisan Lemonade",
    ];
    await ProductModel.destroy({ where: { name: names } });
  },
};
