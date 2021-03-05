'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
      User.hasMany(models.Config, { foreignKey: 'userId', as: 'configs' });
      User.hasMany(models.Post, { foreignKey: 'userId', as: 'posts' });
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    sex: DataTypes.STRING,
    birthPlace: DataTypes.STRING,
    birthAt: DataTypes.DATE,
    biography: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.JSON,
    webLinks: DataTypes.JSON,
    settings: DataTypes.JSON,
    avatar: DataTypes.STRING,
    refreshToken: DataTypes.TEXT,
    sessionAt: DataTypes.DATE,
    verified: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return User;
};