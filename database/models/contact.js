'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Contact.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    sex: DataTypes.STRING,
    title: DataTypes.STRING,
    email: DataTypes.STRING,
    country: DataTypes.JSON,
    message: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contact',
  });
  Contact.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return Contact;
};