'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      key: {
        allowNull: false,
        type: Sequelize.STRING(15),
        unique: true
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER(1),
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Roles');
  }
};