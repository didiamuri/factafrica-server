'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Country.hasMany(models.Post, { foreignKey: 'countryId', as: 'posts' });
    }
  };
  Country.init({
    code: DataTypes.STRING,
    country: DataTypes.STRING,
    status: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Country',
  });
  Country.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return Country;
};