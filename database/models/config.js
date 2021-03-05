'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Config.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  };
  Config.init({
    publicKey: DataTypes.STRING,
    expireAt: DataTypes.DATE,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Config',
  });
  Config.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return Config;
};