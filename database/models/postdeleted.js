'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class PostDeleted extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostDeleted.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    }
  };
  PostDeleted.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'PostDeleted',
  });
  PostDeleted.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return PostDeleted;
};