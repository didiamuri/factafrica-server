'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Post.belongsTo(models.Country, { foreignKey: 'countryId', as: 'country' });
      Post.hasMany(models.PostUpdated, { foreignKey: 'postId', as: 'updateds' });
      Post.hasMany(models.PostDeleted, { foreignKey: 'postId', as: 'deleteds' });
    }
  };
  Post.init({
    title: DataTypes.STRING,
    shortDescruption: DataTypes.TEXT,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    status: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  Post.beforeCreate(async (res) => {
    return res.id = uuid(); 
  });
  return Post;
};