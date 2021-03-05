'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
    }
  };
  Role.init({
    key: DataTypes.STRING,
    value: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role',
  });
  Role.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return Role;
};