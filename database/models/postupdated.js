'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class PostUpdated extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostUpdated.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    }
  };
  PostUpdated.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'PostUpdated',
  });
  PostUpdated.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return PostUpdated;
};