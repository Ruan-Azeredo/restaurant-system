"use strict";

require("ts-node").register({
  compilerOptions: { module: "CommonJS", esModuleInterop: true },
});
require("tsconfig-paths").register();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ClientModel = require("../schemas/clients.sequelize.ts").default;
    
    await ClientModel.create({
      name: "John Doe",
      address: "123 Main St",
    });
  },

  async down(queryInterface, Sequelize) {
    const ClientModel = require("../schemas/clients.sequelize.ts").default;
    await ClientModel.destroy({ where: { name: "John Doe" } });
  },
};
