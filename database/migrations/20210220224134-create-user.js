'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      roleId: {
        llowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Roles',
          key: 'id'
        }
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
      birthPlace: {
        llowNull: true,
        type: Sequelize.STRING(128)
      },
      birthAt: {
        llowNull: true,
        type: Sequelize.DATE
      },
      biography: {
        llowNull: true,
        type: Sequelize.TEXT
      },
      email: {
        llowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        llowNull: true,
        type: Sequelize.CHAR(64)
      },
      phoneNumber: {
        llowNull: true,
        type: Sequelize.STRING(15),
        unique: true
      },
      address: {
        llowNull: true,
        type: Sequelize.JSON
      },
      webLinks: {
        llowNull: true,
        type: Sequelize.JSON
      },
      settings: {
        llowNull: true,
        type: Sequelize.JSON
      },
      avatar: {
        llowNull: true,
        type: Sequelize.STRING
      },
      refreshToken: {
        llowNull: true,
        type: Sequelize.TEXT
      },
      sessionAt: {
        llowNull: true,
        type: Sequelize.DATE
      },
      verified: {
        llowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
      },
      deletedAt: {
        llowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};