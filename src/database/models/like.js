'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // like.hasMany(models.)
    }
  };
  like.init({
    commentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    luotthich: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'likes',
  });
  return like;
};