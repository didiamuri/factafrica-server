'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      firstName: {
        llowNull: false,
        type: Sequelize.STRING(50)
      },
      lastName: {
        llowNull: false,
        type: Sequelize.STRING(50)
      },
      sex: {
        llowNull: false,
        type: Sequelize.STRING(15)
      },
      title: {
        llowNull: false,
        type: Sequelize.STRING(50)
      },
      email: {
        llowNull: false,
        type: Sequelize.STRING
      },
      country: {
        llowNull: false,
        type: Sequelize.JSON
      },
      message: {
        llowNull: false,
        type: Sequelize.TEXT
      },
      status: {
        llowNull: false,
        type: Sequelize.INTEGER(1),
        defaultValue: 0
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
    await queryInterface.dropTable('Contacts');
  }
};